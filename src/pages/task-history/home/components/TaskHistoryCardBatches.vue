<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toOrdinal } from '@/lib/utils';
import type { TaskHistoryBatch } from '@/types/taskHistory';
import { ClipboardList, Dot, Layers } from 'lucide-vue-next';
import TaskHistoryBadge from '../../components/TaskHistoryBadge.vue';
import { useRoute } from 'vue-router';


const route = useRoute() 
const props = defineProps<{
    batches: TaskHistoryBatch[]
}>()

</script>
<template>
    <div class="px-4">
        <Accordion type="multiple" :default-value="[<string>route.query.batch]">
            <AccordionItem v-for="batch in batches" :key="batch.id" :value="batch.id">
                <AccordionTrigger class="py-2 gap-4">
                    <div class="flex gap-2">
                        <TaskHistoryBadge :icon="Layers"> {{ toOrdinal(batch.batch_index + 1) }} Batch
                        </TaskHistoryBadge>
                        <TaskHistoryBadge :icon="ClipboardList">{{ batch.task_qty }} Task(s)</TaskHistoryBadge>
                        <TaskHistoryBadge :icon="Dot">{{ batch.status_code }}</TaskHistoryBadge>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <slot :items="batch.tasks"></slot>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>



<style scoped></style>