<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatReadableDate, toOrdinal } from '@/lib/utils';
import WipTaskDataTable from './WipTaskDataTable.vue';
import { LoaderCircle } from 'lucide-vue-next';
import type { WipBatch } from '@/types/wip';

const props = defineProps<{
    wipBatch: WipBatch[]
}>()
const emits = defineEmits<{
    (e: 'select', batch: WipBatch): void
}>()
</script>
<template>
    <Accordion>
        <AccordionItem v-for="batch in wipBatch" :key="batch.batch_id" :value="batch.batch_id">
            <AccordionTrigger @click="$emit('select', batch)" class="gap-2">
                <span>{{ toOrdinal(batch.batch_index + 1) }} Batch</span>

                <div class="ml-auto text-muted-foreground font-normal text-sm flex items-center gap-2">
                    {{ formatReadableDate(batch.start_date) }}
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <slot v-if="batch.tasks && batch.tasks.length" :batch="batch" />
                <p v-else class="text-muted-foreground flex items-center gap-2 justify-center">
                    <LoaderCircle class="animate-spin" /> Retrieving data, please wait.
                </p>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
</template>



<style scoped></style>