<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { batchWipSuccessKey } from '@/lib/injectionKeys';
import { formatReadableDate, getIconByTaskStatus } from '@/lib/utils';
import { useWipStore } from '@/stores/wipStore';
import type { PlanBatch } from '@/types/planning';
import type { TaskStatus, WipBatch, WipTask } from '@/types/wip';
import { AlertCircle, CheckCircle, Flag, LoaderCircle, Pause, Play, Square, X, XCircle } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { inject, onUpdated, ref, watch, watchEffect } from 'vue';
import { toast } from 'vue-sonner';

const dialog = defineModel({ default: false })

const props = defineProps<{
    batch: WipBatch,
    taskId: string
}>()
const wipStore = useWipStore()
const { loading } = storeToRefs(wipStore)

const { canFinish, canPause, canStart, handleFinishTask, handlePauseTask, handleStartTask, wipLoading } = useTaskControl()
const task = ref<WipTask>()
const madeChanges = ref(false) //this will determine if batchTask should re-fetch or not 
const fetchBatchTasks = inject(batchWipSuccessKey);

watch(() => props.taskId, async (newValue, oldValue) => {
    madeChanges.value = false
    await fetchTask()
})

//refetch the batch tasks if there's any changes that've made
onUpdated(async () => {
    if (fetchBatchTasks && madeChanges.value)
        fetchBatchTasks(props.batch)
})

function useTaskControl() {

    const wipStore = useWipStore()
    const { errors, loading: wipLoading } = storeToRefs(wipStore)

    function canStart(status: TaskStatus) {
        return status === 'pending' || status === 'paused'
    }

    function canPause(status: TaskStatus) {
        return status === 'ongoing'
    }

    function canFinish(status: TaskStatus) {
        return status === 'ongoing' || status === 'pending'
    }

    async function handleStartTask(task: WipTask) {

        if (!canStart(task.status)) return;

        await wipStore.changeTaskStatus(task.id, { status: 'start' })

        if (!errors.value) {
            madeChanges.value = true;
            await fetchTask()
            toast.info('Task info', {
                description: 'Task successfully started'
            })

        } else toast.error('Task info', {
            description: 'Something went wrong while starting the task'
        })

    }
    async function handlePauseTask(task: WipTask) {
        if (!canPause(task.status)) return;

        await wipStore.changeTaskStatus(task.id, { status: 'pause' })

        if (!errors.value) {
            madeChanges.value = true;
            await fetchTask()

            toast.info('Task info', {
                description: 'Task successfully paused'
            })

        } else toast.error('Task info', {
            description: 'Something went wrong while pausing the task'
        })

    }
    async function handleFinishTask(task: WipTask) {
        if (!canFinish(task.status)) return;

        await wipStore.changeTaskStatus(task.id, { status: 'done' })

        if (!errors.value) {
            madeChanges.value = true;
            await fetchTask()

            toast.info('Task info', {
                description: 'Task finished.'
            })
        } else toast.error('Task info', {
            description: 'Something went wrong while finishing the task'
        })

    }

    return {
        canStart,
        canPause,
        canFinish,
        handleStartTask,
        handleFinishTask,
        handlePauseTask,
        wipLoading
    }
}

async function fetchTask() {
    task.value = await wipStore.getWipTask(props.taskId)
}
/* INITIALIZE */
task.value = await wipStore.getWipTask(props.taskId)

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
                <span>UUID:</span> <span class="uppercase">{{ task.task_plan_id }}</span>

                <span>Product SKU:</span> <span>{{ task.sku }}</span>

                <span>Ready to start:</span>
                <span class="flex gap-2 items-center">
                    <component :is="task.is_startable ? CheckCircle : XCircle" class="size-4" /> {{ task.is_startable ?
                        'Yes' : 'Not yet' }}
                </span>

                <span>Planned start date:</span> <span>{{ formatReadableDate(task.can_accessed_at) }}</span>

                <span>Status:</span>
                <Badge class="w-fit gap-1 capitalize">
                    <component :is="getIconByTaskStatus(task.status)" class="size-4" /> {{ task.status }}
                </Badge>

                <span>Required manpower:</span> <span>{{ task.manpower }}</span>
            </div>
            <div class="border rounded-md shadow-sm p-4">
                <p class="font-medium mb-2">Workers assigned:</p>

                <ul v-if="task && task.workers && task.workers.length && !loading" class="flex gap-2 flex-wrap">
                    <li v-for="worker in task.workers" :key="worker.id">
                        <ButtonApp size="sm" as="div" variant="secondary">
                            <span> {{ worker.worker_number }} - {{ worker.full_name }}</span>
                            <Separator orientation="vertical" />
                            <ButtonApp variant="icon" size="xs" class="size-4">
                                <X />
                            </ButtonApp>
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
                        <ButtonApp :prepend-icon="Play" :disabled="!canStart(task.status) || wipLoading"
                            @click="handleStartTask(task)" :loading="wipLoading">
                            Start</ButtonApp>
                        <ButtonApp :prepend-icon="Pause" :disabled="!canPause(task.status) || wipLoading"
                            @click="handlePauseTask(task)" :loading="wipLoading">
                            Pause</ButtonApp>
                        <ButtonApp :prepend-icon="Flag" :disabled="!canFinish(task.status) || wipLoading"
                            @click="handleFinishTask(task)" :loading="wipLoading">
                            Finish</ButtonApp>
                    </div>
                </div>
                <div v-else class="flex gap-2 items-center justify-center">
                    <AlertCircle class="size-4 " />
                    <p class="text-sm text-muted-foreground font-medium">You are not able to start this task yet.</p>
                </div>
            </div>
        </DialogScrollContent>
    </Dialog>
</template>



<style scoped></style>