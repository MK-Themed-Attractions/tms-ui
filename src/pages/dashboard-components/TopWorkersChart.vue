<script setup lang="ts">
import { Card } from '@/components/ui/card';
import type { Worker } from '@/types/workers';
import { ChartArea } from 'lucide-vue-next';
import { computed } from 'vue';


const props = defineProps<{
    workers: Worker[]
}>()

const workersData = computed(() => {
    return props.workers.slice(0, 5).map(worker => {
        return {
            name: `${worker.given_name} ${worker.last_name[0]}.`,
            points: worker.run_time ? worker.run_time.current_day : 0,
            department: worker.department?.name
        }
    })
})

const highPointEmployee = computed(() => [...workersData.value].sort((a, b) => b.points - a.points)[0])
const maxPoints = computed(() => +highPointEmployee.value.points.toFixed(2))

const stepArray = computed(() => {
    const stepCount = 10

    if (stepCount < 2) return [maxPoints.value]    // Return only the maxPoints.valueber itself if steps < 2

    const result = [1]
    const interval = Math.floor(maxPoints.value / (stepCount - 1))

    for (let i = 1; i < stepCount - 1; i++) {
        result.push(i * interval)
    }

    result.push(maxPoints.value)                   // Ensure the last value is the target number
    return result
})
</script>

<template>
    <Card class="p-4 grid grid-cols-[minmax(5ch,5rem),auto] gap-x-4 gap-y-2 items-center">
        <div class="col-span-full">
            <h4 class="font-medium flex gap-2">
                <ChartArea /> Top performing employees
            </h4>
            <div class="ml-4">
                <span class="text-7xl font-bold">{{ maxPoints }}</span> <span class="font-medium">pts.</span>
                <p class="text-sm text-muted-foreground">Got by {{ highPointEmployee.name }} of {{
                    highPointEmployee.department }} department</p>
            </div>
        </div>
        <div class="col-start-2  flex justify-between text-xs text-muted-foreground">
            <span v-for="point in stepArray">{{ point }}</span>
        </div>
        <template v-for="worker in workersData" :key="worker">
            <div class="text-sm text-end capitalize">
                {{ worker.name.toLowerCase() }}
            </div>
            <div class="border-b pb-1">
                <div class="h-4 bg-primary rounded-tl-md rounded-bl-md rounded-tr-full rounded-br-full min-w-1"
                    :style="{ maxWidth: `${worker.points / maxPoints * 100}%` }">
                </div>
            </div>
        </template>
    </Card>
</template>


<style scoped></style>