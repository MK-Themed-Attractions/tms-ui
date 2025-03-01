<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatReadableDate, getIconByTaskStatus } from '@/lib/utils';
import { useWipStore } from '@/stores/wipStore';
import type { WipTask } from '@/types/wip';
import { AlertCircle, CheckCircle, LoaderCircle, X, XCircle } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { onUpdated, ref } from 'vue';

const dialog = defineModel({ default: false })

const props = defineProps<{
    task: WipTask
}>()
const wipStore = useWipStore()
const { loading } = storeToRefs(wipStore)
const detailedTask = ref<WipTask>()


onUpdated(async () => {
    //only fetch when dialog is opened and do not refetch when task is already fetched.   
    if (dialog.value && detailedTask.value?.task_plan_id !== props.task.task_plan_id)
        detailedTask.value = await wipStore.getWipTask(props.task.task_plan_id)
})

/* INITIALIZE */
detailedTask.value = await wipStore.getWipTask(props.task.task_plan_id)

</script>
<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent @interact-outside="e => e.preventDefault()" class="max-w-[40rem] text-sm ">
            <DialogHeader>
                <DialogTitle>Task details</DialogTitle>
                <DialogDescription>View detailed information about this task including assigned workers and status.
                </DialogDescription>
            </DialogHeader>
            <div
                class="shadow-sm flex flex-wrap flex-col max-h-[12rem] border rounded-md p-4 [&>*:nth-child(even)]:mb-2 [&>*:nth-child(even)]:font-medium [&>*:nth-child(odd)]:text-muted-foreground">
                <span>UUID:</span> <span class="uppercase">{{ task.task_plan_id }}</span>

                <span>Product SKU:</span> <span>{{ task.sku }}</span>

                <span>Startable:</span>
                <span class="flex gap-2 items-center">
                    <component :is="task.is_startable ? CheckCircle : XCircle" class="size-4" /> {{ task.is_startable ?
                        'Yes' : 'Not yet' }}
                </span>

                <span>Can be start at:</span> <span>{{ formatReadableDate(task.can_accessed_at) }}</span>

                <span>Status:</span>
                <Badge class="w-fit gap-1 capitalize">
                    <component :is="getIconByTaskStatus(task.status)" class="size-4" /> {{ task.status }}
                </Badge>

                <span>Current department:</span> <span>{{ task.workcenter.name }}</span>

                <span>Required manpower:</span> <span>{{ task.manpower }}</span>
            </div>
            <div class="border rounded-md shadow-sm p-4">
                <p class="font-medium mb-2">Workers assigned:</p>

                <ul v-if="detailedTask && detailedTask.workers && !loading" class="flex gap-2 flex-wrap">
                    <li v-for="worker in detailedTask?.workers" :key="worker.id">
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
        </DialogScrollContent>
    </Dialog>
</template>



<style scoped></style>