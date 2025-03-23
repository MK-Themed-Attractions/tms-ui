<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { TaskHistoryTask } from '@/types/taskHistory';
import TaskHistoryBadge from '../../components/TaskHistoryBadge.vue';
import { Calendar1, CalendarFold, CircleDot, Dot, Hash } from 'lucide-vue-next';
import { formatReadableDate } from '@/lib/utils';


const props = defineProps<{
    tasks: TaskHistoryTask[]
}>()
</script>
<template>
    <Accordion type="multiple" class="pl-6">
        <AccordionItem v-for="task in tasks" :key="task.id" :value="task.id">
            <AccordionTrigger class="gap-2 ">
                <div class="flex gap-2 grow">
                    <div class="text-muted-foreground flex items-center gap-2 text-xs">
                        <Hash class="size-4" /> <span>{{ task.id }}</span>
                        <Dot /> <span>{{ task.status_code }}</span>
                    </div>
                    <div class="ml-auto text-muted-foreground flex items-center gap-2 text-xs">
                        <CalendarFold class="size-4" /> {{
                            formatReadableDate(task.start_date) }}
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent>
                <slot :item="task" />
            </AccordionContent>
        </AccordionItem>
    </Accordion>
</template>



<style scoped></style>