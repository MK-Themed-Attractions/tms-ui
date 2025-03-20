<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import WipWorkerDataTable from './WipWorkerDataTable.vue';
import { Check, LoaderCircle, Minus } from 'lucide-vue-next';
import { computed, inject, nextTick, ref } from 'vue';
import type { Worker } from '@/types/workers';
import { ButtonApp } from '@/components/app/button';
import { useWipStore } from '@/stores/wipStore';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { Badge } from '@/components/ui/badge';
import type { WipBatch } from '@/types/wip';
import { batchWipSuccessKey } from '@/lib/injectionKeys';

const props = defineProps<{
    batch: {
        batch: WipBatch;
        taskIds: string[]
    }
}>()
const emits = defineEmits<{
    (e: 'success'): void;
}>()

const fetchBatchWip = inject(batchWipSuccessKey);
const dialog = defineModel({ default: false })
const selectedTaskIds = defineModel<string[]>('selectedTaskIds', { default: [] })
const wipStore = useWipStore()
const { loading: wipLoading, errors: wipErrors } = storeToRefs(wipStore)

const selectedWorkers = ref<{ id: string; rfid: string }[]>([])
const taskIds = computed(() => props.batch.taskIds)

function handleWorkerSelect(workers: Worker[]) {
    const workerIds = workers.map(worker => {
        return {
            id: worker.id,
            rfid: worker.rfid_card
        }
    })

    selectedWorkers.value = workerIds;
}
function handleTaskSelect(taskId: string) {
    const taskIndex = selectedTaskIds.value.indexOf(taskId)

    if (taskIndex !== -1)
        selectedTaskIds.value.splice(taskIndex, 1)
    else
        selectedTaskIds.value.push(taskId)
}

async function assignWorkers() {
    await wipStore.assignWorkersToTasks({ tasks: selectedTaskIds.value, workers: selectedWorkers.value })

    if (!wipErrors.value) {
        emits('success');
        toast.info('Task assignment', {
            description: 'Task successfully assigned.'
        })

        if (fetchBatchWip) await fetchBatchWip(props.batch.batch)
        dialog.value = false;
    } else {
        toast.error('Task Error', {
            description: 'Something went wrong while assigning tasks.'
        })
    }
}
</script>

<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent @interact-outside="(e) => e.preventDefault()" class="max-w-[40rem]">
            <DialogHeader>
                <DialogTitle>Assign workers</DialogTitle>
                <DialogDescription>You can assign multiple workers to tasks and choose which tasks to assign to the
                    selected workers.</DialogDescription>
            </DialogHeader>

            <div class="space-y-2">
                <ul class="border rounded-md p-4 border-dashed flex flex-wrap gap-2">
                    <li v-for="taskId in taskIds" :key="taskId">
                        <Badge :variant="selectedTaskIds.includes(taskId) ? 'default' : 'outline'"
                            class="uppercase flex gap-1 items-center cursor-pointer" @click="handleTaskSelect(taskId)">
                            <component :is="selectedTaskIds.includes(taskId) ? Check : Minus" class="size-4" /> {{
                                taskId }}
                        </Badge>
                    </li>
                </ul>
                <Suspense>
                    <WipWorkerDataTable @change="handleWorkerSelect" />
                    <template #fallback>
                        <div
                            class="border rounded-md p-4 text-sm text-muted-foreground flex gap-2 items-center justify-center">
                            <LoaderCircle class="animate-spin" /> Retrieving data, please wait.
                        </div>
                    </template>
                </Suspense>
                <ButtonApp :disabled="!selectedWorkers.length || !selectedTaskIds.length || wipLoading"
                    :loading="wipLoading" @click="assignWorkers">
                    Assign</ButtonApp>
            </div>
        </DialogScrollContent>
    </Dialog>
</template>

<style scoped></style>