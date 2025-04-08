<script setup lang="ts">
import { Dot } from 'lucide-vue-next';
import { computed, } from 'vue';
import type { CalendarEventConcreteData } from '.';


const props = defineProps<{
    anchor: { width: number, height: number },
    event: CalendarEventConcreteData
}>()

const differenceInDate = computed(() => {
    return Math.abs(props.event.endDate.compare(props.event.startDate))
}
)

</script>
<template>
    <div class="absolute inset-x-0 z-10 bg-muted-foreground rounded-md flex items-center text-xs h-[min(1vw,2rem)] top-0 border"
        ref="eventRef" :style="{
            width: `${(anchor.width * (differenceInDate + 1)) + (8 * differenceInDate)}px`,
            backgroundColor: `${event.color}a2`,
            borderColor: event.color,
        }">
        <Dot /> <span class="hidden md:inline">plan: {{ event.data }}</span>
    </div>
</template>



<style scoped></style>