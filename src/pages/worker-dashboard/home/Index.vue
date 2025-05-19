<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import RFIDInfo from './components/RFIDInfo.vue';
import NoTaskFound from './components/NoTaskFound.vue';
import WorkerInfo from './components/WorkerInfo.vue';
import type { Worker } from '@/types/workers';
import { useWorkerStore } from '@/stores/workerStore';
import { taskDataTableColumns, type RFIDScannerEvent, type RFIDState, type TaskOperationType } from '..';
import type { TaskStatus, WipPlan, WipPlanQueryParams, WipTask, WorkerTasksQueryParams } from '@/types/wip';
import { useWipStore } from '@/stores/wipStore';
import { storeToRefs } from 'pinia';
import Loader from '@/components/app/loader/Loader.vue';
import { toast } from 'vue-sonner';
import { ConfirmationDialog } from '@/components/app/confirmation-dialog';
import { useTaskControls } from '@/composables/useTaskControls';
import type { ProductRoutingWorkCenterType } from '@/types/products';
import { useSimplePaginate } from '@/composables/usePaginate';
import { InfiniteScroll } from '@/components/app/infinite-scroll';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DataTable } from '@/components/app/data-table';
import { getIconByTaskStatus, getS3Link, toOrdinal } from '@/lib/utils';
import { Calendar, CircleCheck, Ellipsis, XCircle } from 'lucide-vue-next';
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import WorkerDropdown from './components/WorkerDropdown.vue';
import { ButtonApp } from '@/components/app/button';
import InfiniteScrollTrigger from '@/components/app/infinite-scroll/InfiniteScrollTrigger.vue';
import WorkerBatchOperationDropdown from './components/WorkerBatchOperationDropdown.vue';
import { ImageApp } from '@/components/app/image';
import { TaskGroupLabel } from '@/components/app/task-group';
import type { WorkerTaskPriority } from '../../../types/wip';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useToastUIStore } from '@/stores/ui/toastUIStore';


const workerStore = useWorkerStore()
const wipStore = useWipStore()
const productStore = useProductStore()
const router = useRouter()
const { errors: wipErrors } = storeToRefs(wipStore)
const { fetchNextWorkerTasks, resetInfiniteScroll, workerTasksInfiniteScroll } = useInfiniteScroll()
const { fetchWorker, worker, handleWorkerLogout } = useWorker()
const { fetchWorkerTasks, wipLoading, changeTaskStatus, checkWorkerAvailability } = useWip()
const { handleBatchOperation, showConfirmationDialog, confirmationDialogMessage, handleBatchOperationConfirm, handleTaskOperation, isNotDone } = useBatchOperation()
const { handleKeydown } = useScanner(fetchWorker)
const { handleShowPriorityDialog, priorityTask, showPriorityDialog, handlePriorityConfirm } = usePriorityDialog()

const rfidState = ref<RFIDState>('not-detected')

function useScanner(callBack?: RFIDScannerEvent) {
    const rfid = ref('')
    const scanBuffer = ref(""); // Stores temporary scanned RFID
    const scanStartTime = ref(0)

    const isValidRFID = (data: string) => {
        return /^\d+$/.test(data); // Only allow numbers (adjust if RFID has letters)
    };

    const handleKeydown = async (event: KeyboardEvent) => {
        const currentTime = Date.now();

        // Reset buffer if first keypress or if delay is more than 500ms
        if (!scanStartTime.value || currentTime - scanStartTime.value > 50) {
            scanBuffer.value = "";
        }

        scanStartTime.value = currentTime;

        // Process scan when "Enter" key is pressed
        if (event.key === "Enter") {
            if (isValidRFID(scanBuffer.value)) {
                rfid.value = scanBuffer.value;
                /* fire the callback event  */
                if (callBack)
                    callBack(rfid.value)
            }
            scanBuffer.value = ""; // Reset for the next scan
            return;
        }

        // Append only valid alphanumeric characters (ignore Enter, Escape, Spaces, etc.)
        if (/^[a-zA-Z0-9]$/.test(event.key)) {
            scanBuffer.value += event.key;
        }
    };

    return {
        rfid,
        handleKeydown
    }

}

function useWorker() {

    const worker = ref<Worker>()

    async function fetchWorker(rfid: string) {
        rfidState.value = 'scanning'
        const data = await workerStore.getWorkerByRfid(rfid)

        if (data) {
            rfidState.value = 'detected'
            worker.value = data;
            resetInfiniteScroll()
            await checkWorkerAvailability(worker.value);
            await fetchNextWorkerTasks()
            return;
        }
        rfidState.value = 'not-detected'
    }

    function handleWorkerLogout() {
        worker.value = undefined;
        rfidState.value = 'not-detected'
        resetInfiniteScroll()
    }

    return {
        fetchWorker,
        worker,
        handleWorkerLogout
    }
}

function useWip() {
    const { loading: wipLoading, errors } = storeToRefs(wipStore)
    const selectedFilterSku = ref<string>()
    const { items: workerTasks, paginate } = useSimplePaginate<WipPlan>()

    async function checkWorkerAvailability(worker: Worker, params?: Partial<WorkerTasksQueryParams>) {
        const microservice = worker.department?.ms_url
        wipStore.pointToMicroservice(microservice)

        const workCenters = <ProductRoutingWorkCenterType[]>worker.department?.work_centers

        const data = await wipStore.getWorkerAvailability(worker.id, { work_centers: workCenters, ...params })

        if (data && data.is_available) {
            const task = await wipStore.getWorkerTaskPriority(worker.id, { work_centers: workCenters, ...params })
            if (task) {
                handleShowPriorityDialog(task)
            }
        }
    }

    async function fetchWorkerTasks(worker: Worker, params?: Partial<WorkerTasksQueryParams>) {
        const microservice = worker.department?.ms_url
        wipStore.pointToMicroservice(microservice)

        const workCenters = <ProductRoutingWorkCenterType[]>worker.department?.work_centers
        paginate.value = await wipStore.getWorkerTasks(worker.id, { work_centers: workCenters, ...params })

        return workerTasks.value;
    }

    async function changeTaskStatus(taskOperationType: TaskOperationType, taskIds: string[]) {
        await wipStore.changeTaskStatusArray({ status: taskOperationType as TaskStatus, tasks: taskIds })

        if (!errors.value) {
            if (worker.value) {
                resetInfiniteScroll()
                await fetchNextWorkerTasks()
            }
            toast.info('Batch info', {
                description: 'Batch operation completed successfully.'
            })
        } else {
            toast.error('Batch errors', {
                description: 'Something went wrong...'
            })
        }
    }

    return {
        fetchWorkerTasks,
        workerTasks,
        wipLoading,
        changeTaskStatus,
        selectedFilterSku,
        checkWorkerAvailability
    }
}

function useBatchOperation() {
    const selectedTaskIds = ref<string[]>()
    const selectedTaskOperationType = ref<TaskOperationType>()
    const showConfirmationDialog = ref(false)
    const confirmationDialogMessage = ref<string>()
    const { canStart, canFinish, canPause, isNotDone } = useTaskControls()

    function getTaskValidationByOperation() {
        switch (selectedTaskOperationType.value) {
            case 'start':
                return canStart;
            case 'done':
                return canFinish;
            case 'pause':
                return canPause;
        }
    }

    function handleBatchOperation(taskOperationType: TaskOperationType, tasks?: WipTask[]) {
        if (!tasks) return;

        /* set the operation type */
        selectedTaskOperationType.value = taskOperationType;
        /*task status verification. note: selected task operation type should be assigned first */
        const can = getTaskValidationByOperation();
        /* set the confirmation message */
        confirmationDialogMessage.value = getConfirmationDialogMessage(taskOperationType)
        /* collect tasks ids */
        selectedTaskIds.value = tasks.filter(t => {
            return can!(t.status)
        }).reduce<string[]>((acc, t) => {
            acc.push(t.id)
            return acc;
        }, [])

        /* show the confirmation dialog */
        showConfirmationDialog.value = true;
    }

    function getConfirmationDialogMessage(taskOperationType: TaskOperationType) {
        switch (taskOperationType) {
            case 'start':
                return "All tasks that are PENDING or QC-FAILED will be started."
            case 'pause':
                return 'All tasks that are ONGOING will be paused.'
            case 'done':
                return "All tasks that are ONGOING will be finished."
        }
    }

    /**
     * For single task
     * @param taskOperationType 
     * @param task 
     */
    async function handleTaskOperation(taskOperationType: TaskOperationType, task: WipTask) {
        if (taskOperationType === 'print') {
            const t = toast.loading('Please wait', {
                description: 'Generating BOM, please wait...'
            })
            useToastUIStore().setToast(t)
            await printBom(task)
        } else
            await changeTaskStatus(taskOperationType, [task.id])
    }

    /**
     * User confirmed the dialog
     * for multiple tasks
     */
    async function handleBatchOperationConfirm() {

        if (!selectedTaskIds.value || !selectedTaskIds.value.length || !selectedTaskOperationType.value) {
            toast.warning('No tasks affected.');
            return;
        };

        await changeTaskStatus(selectedTaskOperationType.value, selectedTaskIds.value)
    }

    return {
        selectedTaskIds,
        selectedTaskOperationType,
        showConfirmationDialog,
        confirmationDialogMessage,
        handleBatchOperation,
        handleBatchOperationConfirm,
        handleTaskOperation,
        isNotDone
    }
}

function useInfiniteScroll() {
    const page = ref(0)
    const workerTasksInfiniteScroll = ref<WipPlan[]>([])

    async function fetchNextWorkerTasks(cb?: (canAddMore: boolean) => void) {
        if (!worker.value) return;

        const res = await fetchWorkerTasks(worker.value, { page: ++page.value })
        if (res && res.length) {
            workerTasksInfiniteScroll.value.push(...res)
        } else if (cb) {
            cb(false)
        }
    }

    function resetInfiniteScroll() {
        page.value = 0;
        workerTasksInfiniteScroll.value = []
    }

    return {
        fetchNextWorkerTasks,
        resetInfiniteScroll,
        workerTasksInfiniteScroll
    }
}

function usePriorityDialog() {
    const showPriorityDialog = ref(false)
    const priorityTask = ref<WorkerTaskPriority>()

    function handleShowPriorityDialog(task: WorkerTaskPriority) {
        priorityTask.value = task;
        showPriorityDialog.value = true;
    }

    async function handlePriorityConfirm() {
        if (!worker.value || !priorityTask.value) return;

        const payload = {
            workers: [worker.value.id],
            tasks: [priorityTask.value.id]
        }
        await wipStore.assignWorkersToTasks(payload)

        if (!wipErrors.value) {
            resetInfiniteScroll()
            await fetchNextWorkerTasks()
            toast.info('Assigning Info', {
                description: 'You\'ve successfully assigned yourself the task'
            })
        } else {
            toast.error('Assigning Error', {
                description: 'Something went wrong while assigning yourself to the task'
            })
        }
    }

    return {
        showPriorityDialog,
        handleShowPriorityDialog,
        priorityTask,
        handlePriorityConfirm
    }
}

async function printBom(task: WipTask) {
    const planCode = workerTasksInfiniteScroll.value.find(wt => wt.plan_id === task.plan_id)?.code
    const product = await productStore.getProduct(task.sku, {
        includes: 'routings'
    })
    const boms = await productStore.getProductRoutingBom(task.sku, {
        routing_link_code: task.operation_code
    })
    useToastUIStore().dismissLastAddedToast()
    const routing = computed(() => product?.routings?.find(r => r.operation_code === task.operation_code))

    const routeData = router.resolve({
        name: 'printBom', query: {
            planCode: planCode,
            product: JSON.stringify(product),
            routing: JSON.stringify(routing.value),
            task: JSON.stringify(task),
            boms: JSON.stringify(boms)
        }
    })

    window.open(routeData.href, '_blank')
}

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
    <div class="container p-6 space-y-6 h-screen">
        <div>
            <h1 class="text-2xl font-medium">Worker Dashboard</h1>
            <p class="text-sm text-muted-foreground max-w-[78ch]"> Scan your RFID and select your assigned tasks. You
                can start tasks
                individually or in batches.
                You will be automatically logged out after each action or if you remain idle for too long.</p>
        </div>
        <header class="flex flex-wrap gap-4 flex-col lg:flex-row">
            <RFIDInfo :state="rfidState" class="mx-auto lg:m-0" />
            <WorkerInfo v-if="worker" class="flex-1" :worker="worker" @logout="handleWorkerLogout" />

        </header>

        <InfiniteScroll v-if="workerTasksInfiniteScroll && workerTasksInfiniteScroll.length && worker"
            class="flex flex-wrap !flex-row gap-4" @trigger="fetchNextWorkerTasks">
            <Card v-for="plan in workerTasksInfiniteScroll" :key="plan.id" class="basis-[30rem] grow p-4">
                <div class="border rounded-md p-2 bg-muted/20 flex gap-4 text-sm">
                    <div>
                        <span class="text-xs text-muted-foreground">Plan code</span>
                        <p class="font-medium">{{ plan.code }}</p>
                    </div>
                    <div>
                        <span class="text-xs text-muted-foreground">SKU</span>
                        <p class="font-medium">{{ plan.sku }}</p>
                    </div>
                    <div>
                        <span class="text-xs text-muted-foreground">Status</span>
                        <p class="font-medium">{{ plan.status_code }}</p>
                    </div>
                </div>
                <Accordion type="multiple">
                    <AccordionItem v-for="batch in plan.batch_data" :key="batch.id" :value="batch.id">
                        <AccordionTrigger class="justify-between items-center text-xs">
                            <span>{{ toOrdinal(batch.batch_index + 1) }} Batch</span>
                            <span class="ml-auto flex gap-2 px-1 text-xs text-muted-foreground">
                                <Calendar class="size-4" />{{ batch.start_date }}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <DataTable v-if="batch.tasks" :items="batch.tasks" :columns="taskDataTableColumns">
                                <template #header.actions>
                                    <TableCell>
                                        <WorkerBatchOperationDropdown :tasks="batch.tasks"
                                            @select="handleBatchOperation">
                                            <ButtonApp size="icon" variant="ghost">
                                                <Ellipsis />
                                            </ButtonApp>
                                        </WorkerBatchOperationDropdown>
                                    </TableCell>
                                </template>
                                <template #item.id="{ item }">
                                    <TableCell class="uppercase" v-if="!wipLoading">
                                        {{ item.id }}
                                    </TableCell>
                                    <TableCell v-else>
                                        <div class="h-2 bg-muted rounded-full">
                                        </div>
                                    </TableCell>
                                </template>
                                <template #item.status="{ item }">
                                    <TableCell class="capitalize" v-if="!wipLoading">
                                        <Badge variant="secondary" class="gap-1">
                                            <component :is="getIconByTaskStatus(item.status)" class="size-4" /> {{
                                                item.status }}
                                        </Badge>
                                    </TableCell>
                                    <TableCell v-else>
                                        <div class="h-2 bg-muted rounded-full">
                                        </div>
                                    </TableCell>
                                </template>
                                <template #item.is_startable="{ item }">
                                    <TableCell v-if="!wipLoading">
                                        <component :is="item.is_startable ? CircleCheck : XCircle" class="size-4" />
                                    </TableCell>
                                    <TableCell v-else>
                                        <div class="h-2 bg-muted rounded-full">
                                        </div>
                                    </TableCell>
                                </template>
                                <template #item.actions="{ item }">
                                    <TableCell v-if="isNotDone(item.status)">
                                        <WorkerDropdown :task="item" @select="handleTaskOperation">
                                            <ButtonApp size="icon" variant="ghost" :disabled="wipLoading">
                                                <Ellipsis />
                                            </ButtonApp>
                                        </WorkerDropdown>
                                    </TableCell>
                                </template>
                            </DataTable>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>

            <InfiniteScrollTrigger class="basis-full" />
        </InfiniteScroll>
        <Loader v-else-if="wipLoading" class="min-h-[60vh]" description="Loading, please wait..." />

        <ConfirmationDialog v-model="showConfirmationDialog" :description="confirmationDialogMessage"
            @yes="handleBatchOperationConfirm" />

        <ConfirmationDialog v-if="priorityTask" v-model="showPriorityDialog" title="You don't have any tasks"
            description="You may manually assign yourself to the task listed below if you'd like. However, please note that even after assigning yourself, 
            you will not be able to start the task unless it is marked as 'available'" yes-message="Yes, assign me"
            :close-on-click-outside="false" @yes="handlePriorityConfirm">
            <div>
                <p>Assign yourself to:</p>
                <div class="bg-muted/20 p-4 rounded-md flex gap-4 items-center flex-wrap">
                    <div class="max-w-[3rem]">
                        <ImageApp :image="getS3Link(priorityTask.product_data?.image?.filename || '', 'small')" />
                    </div>
                    <TaskGroupLabel label="SKU">{{ priorityTask.sku }} </TaskGroupLabel>
                    <TaskGroupLabel label="Plan code">{{ priorityTask.plan_data.code }} </TaskGroupLabel>
                    <TaskGroupLabel label="Routing">{{ priorityTask.operation_code }} </TaskGroupLabel>
                    <TaskGroupLabel label="Manpower">{{ priorityTask.manpower }} </TaskGroupLabel>
                </div>
            </div>
        </ConfirmationDialog>
    </div>
</template>


<style scoped></style>