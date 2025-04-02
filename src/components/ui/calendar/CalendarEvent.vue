<script setup lang="ts">
import { Dot } from 'lucide-vue-next';
import type { DateValue } from '@internationalized/date';
import { computed } from 'vue';

const props = defineProps<{
    anchor: { width: number, height: number },
    event: { data: any, startDate: DateValue, endDate: DateValue }
}>()

const differenceInDate = computed(() => {
    if (Math.abs(props.event.endDate.compare(props.event.startDate)) === 0) return 1;
    return Math.abs(props.event.endDate.compare(props.event.startDate))
}
)
</script>
<template>
    <div class="bg-muted-foreground text-white rounded-md flex items-center text-xs " :style="{
        width: `${(anchor.width * differenceInDate) + (8 * differenceInDate)}px`
    }">
        <Dot /> <span class="hidden md:inline">plan: {{ differenceInDate }}</span>
    </div>
</template>



<style scoped></style>