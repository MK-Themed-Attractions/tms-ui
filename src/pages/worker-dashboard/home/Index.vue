<script setup lang="ts">

import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/stores/authStore';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import RFIDInfo from './components/RFIDInfo.vue';
import NoTaskFound from './components/NoTaskFound.vue';
import WorkerInfo from './components/WorkerInfo.vue';
import WorkerToolbar from './components/WorkerToolbar.vue';
import type { Worker } from '@/types/workers';
import { useWorkerStore } from '@/stores/workerStore';
import type { RFIDScannerEvent, RFIDState, TaskOperationType } from '..';
import type { TaskStatus, WipTask } from '@/types/wip';
import { useWipStore } from '@/stores/wipStore';
import WorkerTaskCard from './components/WorkerTaskCard.vue';
import { storeToRefs } from 'pinia';
import WorkerTaskCardItem from './components/WorkerTaskCardItem.vue';
import Loader from '@/components/app/loader/Loader.vue';
import WorkerTaskCardToolbar from './components/WorkerTaskCardToolbar.vue';
import { toast } from 'vue-sonner';
import { ConfirmationDialog } from '@/components/app/confirmation-dialog';
import { useTaskControls } from '@/composables/useTaskControls';
import WorkerTaskCardDropdown from './components/WorkerTaskCardDropdown.vue';
import { Ellipsis } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';


const workerStore = useWorkerStore()
const wipStore = useWipStore()
const { fetchWorker, worker } = useWorker()
const { fetchWorkerTasks, workerTasks, wipLoading, changeTaskStatus, selectedFilterSku, filteredWorkerTasks, tasksCount } = useWip()
const { handleBatchOperation, showConfirmationDialog, confirmationDialogMessage, handleBatchOperationConfirm, handleTaskOperation } = useBatchOperation()
const { handleKeydown } = useScanner(fetchWorker)

const rfidState = ref<RFIDState>('not-detected')

function useScanner(callBack?: RFIDScannerEvent) {
    const rfid = ref('')
    const scanBuffer = ref(""); // Stores temporary scanned RFID
    const scanStartTime = ref(0)

    const isValidRFID = (data: string) => {
        return /^\d+$/.test(data); // Only allow numbers (adjust if RFID has letters)
    };

    const handleKeydown = (event: KeyboardEvent) => {
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
            await fetchWorkerTasks(data)
            return;
        }
        rfidState.value = 'not-detected'
    }

    return {
        fetchWorker,
        worker
    }
}

function useWip() {

    const { loading: wipLoading, errors } = storeToRefs(wipStore)
    const workerTasks = ref<{ [batchId: string]: WipTask[] }>()
    const selectedFilterSku = ref<string>()

    const filteredWorkerTasks = computed(() => {
        if (!workerTasks.value || !selectedFilterSku.value) {
            return workerTasks.value;  // Return original when no filter is applied
        }

        return Object.entries(workerTasks.value).reduce((acc, [batchId, tasks]) => {
            const filteredTasks = tasks.filter(t => t.sku === selectedFilterSku.value);
            if (filteredTasks.length) {
                acc[batchId] = filteredTasks;
            }
            return acc;
        }, {} as { [batchId: string]: WipTask[] });
    })

    const tasksCount = computed(() => {
        if (!workerTasks.value) return 0

        return Object.values(workerTasks.value)
            .reduce((acc, tasks) => acc + tasks.length, 0);
    })

    async function fetchWorkerTasks(worker: Worker) {
        const microservice = worker.department?.ms_url
        wipStore.pointToMicroservice(microservice)

        const data = await wipStore.getWorkerTasks(worker.id)

        if (data)
            workerTasks.value = data
    }

    async function changeTaskStatus(taskOperationType: TaskOperationType, taskIds: string[]) {
        await wipStore.changeTaskStatusArray({ status: taskOperationType as TaskStatus, tasks: taskIds })

        if (!errors.value) {
            if (worker.value)
                await fetchWorkerTasks(worker.value)
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
        filteredWorkerTasks,
        tasksCount
    }
}

function useBatchOperation() {

    const selectedTaskIds = ref<string[]>()
    const selectedTaskOperationType = ref<TaskOperationType>()
    const showConfirmationDialog = ref(false)
    const confirmationDialogMessage = ref<string>()
    const { canStart, canFinish, canPause } = useTaskControls()

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

    function handleBatchOperation(taskOperationType: TaskOperationType, tasks: WipTask[]) {
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
        handleTaskOperation
    }
}

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
    <div class="container p-6 space-y-6 h-screen" v-if="true">
        <div>
            <h1 class="text-2xl font-medium">Worker Dashboard</h1>
            <p class="text-sm text-muted-foreground max-w-[78ch]"> Scan your RFID and select your assigned tasks. You
                can start tasks
                individually or in batches.
                You will be automatically logged out after each action or if you remain idle for too long. {{ tasksCount
                }}</p>
        </div>
        <div class="flex flex-wrap gap-4 flex-col lg:flex-row">
            <RFIDInfo :state="rfidState" class="mx-auto lg:m-0" />
            <WorkerInfo v-if="worker" class="flex-1" :worker="worker" :stats="{ tasksCount }" />
            <WorkerToolbar v-if="workerTasks" class="grow basis-full" :batch="workerTasks"
                v-model="selectedFilterSku" />
        </div>
        <ScrollArea class="relative isolate h-[62%] overflow-y-auto border rounded-md border-dashed">
            <WorkerTaskCard v-if="filteredWorkerTasks">
                <WorkerTaskCardItem v-for="batch in filteredWorkerTasks" :batch="batch" :loading="wipLoading">
                    <WorkerTaskCardToolbar :tasks="batch" @select="handleBatchOperation">
                    </WorkerTaskCardToolbar>
                    <template #actions="{ item }">
                        <WorkerTaskCardDropdown :task="item" @select="handleTaskOperation">
                            <Button variant="ghost" size="icon">
                                <Ellipsis class="size-4" />
                            </Button>
                        </WorkerTaskCardDropdown>
                    </template>
                </WorkerTaskCardItem>

            </WorkerTaskCard>
            <NoTaskFound v-else-if="!workerTasks && !wipLoading" />
            <Loader v-else class="border-none mt-auto absolute top-1/2 left-1/2 -translate-x-1/2"
                description="Loading, please wait..." />
        </ScrollArea>

        <ConfirmationDialog v-model="showConfirmationDialog" :description="confirmationDialogMessage"
            @yes="handleBatchOperationConfirm" />
    </div>
</template>


<style scoped></style>