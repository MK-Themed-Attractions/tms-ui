<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { batchWipSuccessKey } from '@/lib/injectionKeys';
import { formatReadableDate, getIconByTaskStatus } from '@/lib/utils';
import { useWipStore } from '@/stores/wipStore';
import type { WipBatch, WipTask } from '@/types/wip';
import { AlertCircle, CheckCircle, Delete, Flag, History, LoaderCircle, Pause, Play, Plus, Printer, Trash, X, XCircle } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { inject, ref, watch } from 'vue';
import { useTaskControls } from '../../../../composables/useTaskControls';
import { ConfirmationDialog } from '@/components/app/confirmation-dialog';
import type { Worker } from '@/types/workers';
import { toast } from 'vue-sonner';
import WorkerAssignDialog from './WorkerAssignDialog.vue';
import type { RouteLocationAsRelativeGeneric } from 'vue-router';
import { computed } from '@vue/reactivity';
import type { ProductRoutingWorkCenterType } from '@/types/products';
import BomInfoDialog from './BomInfoDialog.vue';

const dialog = defineModel({ default: false })

const props = defineProps<{
    operationCode: ProductRoutingWorkCenterType
    batch: WipBatch,
    taskId: string
}>()
const wipStore = useWipStore()
const { loading, errors: wipErrors } = storeToRefs(wipStore)

const { canFinish, canPause, canStart, startTask, showWipToast, finishTask, pauseTask, canAssign } = useTaskControls()
const { handleConfirmRemoveWorker,
    showWorkerRemoveConfirmDialog,
    handleRemoveWorker,
    showWorkerAssignDialog,
    handleShowAssignDialog,
    handleRemoveWorkers,
    handleWorkerAssignOnSuccess } = useWorker()
const task = ref<WipTask>()
const selectedTaskIds = ref<string[]>()
const madeChanges = ref(false) //this will determine if batchTask should re-fetch or not 
const fetchBatchTasks = inject(batchWipSuccessKey);
const showBomDialog = ref(false)


/* fetch the task when dialog is opened
and when its when changes are made fetch the batch tasks
to reflect the changes */
watch(dialog, async () => {
    if (dialog.value) {
        await fetchTask()
    } else if (fetchBatchTasks && madeChanges.value) {
        fetchBatchTasks(props.batch)
        madeChanges.value = false
    }
})

const trackHistory = computed(() => {
    return {
        name: 'taskHistoryIndex',
        query: {
            workCenter: task.value?.operation_code,
            batch: task.value?.batch_id,
            task: task.value?.task_plan_id,
            q: task.value?.task_plan_id
        }
    } as RouteLocationAsRelativeGeneric
})

function useWorker() {

    const showWorkerRemoveConfirmDialog = ref(false)
    const selectedWorker = ref<Worker>()
    const showWorkerAssignDialog = ref(false)

    function handleConfirmRemoveWorker(worker: Worker) {
        showWorkerRemoveConfirmDialog.value = true
        selectedWorker.value = worker;
    }

    function handleShowAssignDialog() {
        selectedTaskIds.value = []
        if (task.value)
            selectedTaskIds.value = [task.value.id]
        showWorkerAssignDialog.value = true
    }

    async function handleRemoveWorker() {

        if (!selectedWorker.value || !task.value) return

        showWorkerRemoveConfirmDialog.value = false;

        await wipStore.unassignWorkersFromTasks({
            tasks: [task.value.id],
            workers: [selectedWorker.value.id]
        })
        await fetchTask()


        if (!wipErrors.value) {
            madeChanges.value = true;
            toast.info('Task info', {
                description: 'Worker successfully removed fromt the task.'
            })
        }
        else {
            toast.error('Task info', {
                description: 'Something went wrong while removing worker from task.'
            })

        }
    }
    async function handleRemoveWorkers() {
        if (!task.value || !task.value.workers) return;

        showWorkerRemoveConfirmDialog.value = false

        const taskWorkerIds = task.value?.workers.reduce<string[]>((acc, worker) => {
            acc.push(worker.id)
            return acc;
        }, [])

        await wipStore.unassignWorkersFromTasks({
            workers: taskWorkerIds,
            tasks: [task.value.id]
        })

        if (!wipErrors.value) {
            madeChanges.value = true;
            await fetchTask()
            toast.info('Task Info', {
                description: 'All workers for this task has been removed.'
            })
        } else {
            toast.error('Task Info', {
                description: 'Something went wrong while removing all of the workers.'
            })
        }
    }

    async function handleWorkerAssignOnSuccess() {
        await fetchTask()
        madeChanges.value = true
    }

    return {
        handleRemoveWorker,
        handleConfirmRemoveWorker,
        showWorkerRemoveConfirmDialog,
        showWorkerAssignDialog,
        handleShowAssignDialog,
        handleRemoveWorkers,
        handleWorkerAssignOnSuccess
    }
}

async function handleStartTask(task: WipTask) {
    const status = await startTask(task)
    await fetchTask()
    showWipToast(status)
    madeChanges.value = true;
}

async function handlePauseTask(task: WipTask) {
    const status = await pauseTask(task)
    await fetchTask()
    showWipToast(status)
    madeChanges.value = true;
}

async function handleFinishTask(task: WipTask) {
    const status = await finishTask(task)
    await fetchTask()
    showWipToast(status)

    madeChanges.value = true;
}

async function fetchTask() {
    task.value = await wipStore.getWipTaskById(props.taskId)
}
/* INITIALIZE */
task.value = await wipStore.getWipTaskById(props.taskId)

</script>
<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent @interact-outside="e => e.preventDefault()" class="max-w-[40rem] text-sm ">
            <DialogHeader>
                <DialogTitle>Task details</DialogTitle>
                <DialogDescription>View detailed information about this task including assigned workers and status.
                </DialogDescription>
            </DialogHeader>
            <div v-if="task"
                class="shadow-sm flex flex-wrap flex-col md:max-h-[12rem] border rounded-md p-4 [&>*:nth-child(even)]:mb-2 [&>*:nth-child(even)]:font-medium [&>*:nth-child(odd)]:text-muted-foreground">
                <span>Track History</span>
                <RouterLink :to="trackHistory" target="_blank">
                    <ButtonApp class="px-2 gap-2 h-6" size="sm">
                        <History class="size-4" /> Go to history
                    </ButtonApp>
                </RouterLink>

                <span>Bill of Materials</span>
                <ButtonApp size="sm" class="px-2 gap-2 h-6 w-fit" @click="showBomDialog = true">
                    <Printer /> View/Print
                </ButtonApp>

                <span>Product SKU:</span> <span>{{ task.sku }}</span>

                <span>Ready to start:</span>
                <span class="flex gap-2 items-center">
                    <component :is="task.is_startable ? CheckCircle : XCircle" class="size-4" /> {{ task.is_startable ?
                        'Yes' : 'Not yet' }}
                </span>

                <span>Planned start date:</span> <span>{{ formatReadableDate(task.can_accessed_at) }}</span>

                <span>Status:</span>
                <Badge class="w-fit gap-1 capitalize" variant="secondary">
                    <component :is="getIconByTaskStatus(task.status)" class="size-4" /> {{ task.status }}
                </Badge>

                <span>Required manpower:</span> <span>{{ task.manpower }}</span>


            </div>
            <div class="border rounded-md shadow-sm p-4">
                <div class="flex items-center justify-between gap-2  mb-2">
                    <p class="font-medium">Workers assigned:</p>
                    <div class="flex gap-2" v-if="task && canAssign(task.status)">
                        <ButtonApp size="icon" class="size-6" variant="outline" @click="handleShowAssignDialog">
                            <Plus />
                        </ButtonApp>
                        <ConfirmationDialog title="Remove all workers" @yes="handleRemoveWorkers"
                            description="Removing all workers will result in none of their points being recorded.">
                            <template #activator>
                                <ButtonApp size="icon" class="size-6" variant="outline">
                                    <Trash />
                                </ButtonApp>
                            </template>

                            <div> Are you sure you want to remove all of the workers?</div>
                        </ConfirmationDialog>
                    </div>
                </div>

                <ul v-if="task && task.workers && task.workers.length && !loading" class="flex gap-2 flex-wrap">
                    <li v-for="worker in task.workers" :key="worker.id">
                        <ButtonApp size="sm" as="div" variant="secondary">
                            <span> {{ worker.worker_number }} - {{ worker.full_name }}</span>

                            <template v-if="canAssign(task.status)">
                                <Separator orientation="vertical" />
                                <ButtonApp variant="icon" size="xs" class="size-4"
                                    @click="handleConfirmRemoveWorker(worker)">
                                    <X />
                                </ButtonApp>
                            </template>
                        </ButtonApp>
                    </li>
                </ul>
                <div v-else-if="loading" class="flex items-center text-muted-foreground gap-2 p-2 justify-center">
                    <LoaderCircle class="size-4 animate-spin" /> Retrieving data, please wait.
                </div>
                <div v-else class="flex items-center text-muted-foreground gap-2 p-2 justify-center">
                    <AlertCircle class="size-4" /> Theres no workers assigned to this task
                </div>

            </div>

            <div class="border rounded-md shadow-sm p-4" v-if="task">
                <div v-if="task.is_startable">
                    <p class="font-medium mb-2 ">Controls:</p>
                    <div class="flex items-center gap-2 justify-center flex-wrap">
                        <ButtonApp :prepend-icon="Play" :disabled="!canStart(task.status) || loading"
                            @click="handleStartTask(task)" :loading="loading">
                            Start</ButtonApp>
                        <ButtonApp :prepend-icon="Pause" :disabled="!canPause(task.status) || loading"
                            @click="handlePauseTask(task)" :loading="loading">
                            Pause</ButtonApp>
                        <ButtonApp :prepend-icon="Flag" :disabled="!canFinish(task.status) || loading"
                            @click="handleFinishTask(task)" :loading="loading">
                            Finish</ButtonApp>
                    </div>
                </div>
                <div v-else class="flex gap-2 items-center justify-center">
                    <AlertCircle class="size-4 " />
                    <p class="text-sm text-muted-foreground font-medium">You are not able to start this task yet.</p>
                </div>
            </div>
        </DialogScrollContent>

        <BomInfoDialog v-if="task" v-model="showBomDialog" :task="task" />

        <ConfirmationDialog v-model="showWorkerRemoveConfirmDialog" @yes="handleRemoveWorker" title="Remove worker"
            description="Removing this worker will result in their points not being recorded.">
            Are you sure you want to remove this worker?
        </ConfirmationDialog>

        <WorkerAssignDialog v-if="task" v-model="showWorkerAssignDialog" v-model:selected-task-ids="selectedTaskIds"
            @success="handleWorkerAssignOnSuccess" :batch="{ batch, taskIds: [task.id] }">
        </WorkerAssignDialog>
    </Dialog>
</template>



<style scoped></style>