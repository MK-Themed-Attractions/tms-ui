<script setup lang="ts" generic="T">
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChartArea, Dot } from 'lucide-vue-next';
import { computed } from 'vue';


const props = withDefaults(defineProps<{
    items: T[],
    title?: string,
    category: keyof T,
    name: keyof T,
    categoryStep?: number,
    displayCount?: number
    order?: 'asc' | 'desc'
}>(), {
    order: 'desc',
    categoryStep: 5,
    title: 'Chart'
})

const displayCount = computed(() => props.displayCount || props.items.length)

const sortedItems = computed(() => {
    return [...props.items].sort((a, b) => {
        const aCategory = <number>a[props.category]
        const bCategory = <number>b[props.category]

        return props.order === 'desc' ? bCategory - aCategory : aCategory - bCategory
    }).slice(props.order === 'desc' ? 0 : props.items.length - displayCount.value,
        props.order === 'desc' ? displayCount.value : props.items.length);
})

const highestCategory = computed(() => {
    if (props.order === 'desc') {
        return +(+sortedItems.value[0][props.category]).toFixed(2)
    }
    return +(+sortedItems.value[sortedItems.value.length - 1][props.category]).toFixed(2)
})

const categoryStepper = computed(() => {

    if (props.categoryStep < 2) return [highestCategory.value]

    const result = []
    const interval = Math.floor(highestCategory.value / (props.categoryStep - 1))
    result.push(0)
    for (let i = 1; i < props.categoryStep - 1; i++) {
        result.push(i * interval)
    }

    result.push(highestCategory.value)
    return result;
})

</script>

<template>
    <Card class="p-4 grid grid-cols-[minmax(5ch,5rem),auto] gap-x-4 gap-y-2 items-center">
        <div class="col-span-full">
            <slot name="title">
                <h4 class="font-medium flex gap-2">
                    <ChartArea /> {{ title }}
                </h4>
            </slot>
        </div>
        <div class="col-start-2  flex justify-between text-xs text-muted-foreground">
            <span v-for="step in categoryStepper">{{ step }}</span>
        </div>
        <TooltipProvider :delay-duration="200" :skip-delay-duration="200">
            <template v-for="item in sortedItems" :key="item[name]">
                <div class="text-sm text-end capitalize">
                    {{ (<string>item[name]).toLowerCase() }}
                </div>
                <div class="border-b pb-1">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <div class="h-8 bg-primary rounded-tr-md rounded-br-md min-w-1"
                                :style="{ maxWidth: `${<number>item[category] / highestCategory * 100}%` }">
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p class="flex gap-2">
                                <Dot />{{ (+item[category]).toFixed(2) }} {{ category }}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </template>
        </TooltipProvider>
        <slot name="footer">
            <em class="col-start-2 text-sm text-muted-foreground">
                The {{ order === 'desc' ? 'higher' : 'lower' }} the better.
            </em>
        </slot>
    </Card>
</template>


<style scoped></style>