<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CalendarRange } from 'lucide-vue-next';
import { SelectValue } from 'radix-vue';
import { ref, watch, watchEffect } from 'vue';
import type { SelectedDateRange, WipDateFilterType } from '../../data';
import { endOfMonth, endOfWeek, getLocalTimeZone, startOfMonth, startOfWeek, today } from '@internationalized/date'
import { Skeleton } from '@/components/ui/skeleton';

const props = defineProps<{
    loading?: boolean,
    disabled?: boolean
}>()

const emits = defineEmits<{
    (e: 'select', range: SelectedDateRange): void
}>()
const selectedDate = defineModel<WipDateFilterType>('predefined', { default: 'today' })
const selectedDateRange = defineModel<SelectedDateRange | null>({ default: null })
const openRangeDate = ref(false)

const tz = getLocalTimeZone()
const currentDate = today(tz)

watchEffect(() => {
    if (selectedDate.value === 'custom') {
        openRangeDate.value = true
    } else {
        switch (selectedDate.value) {
            case 'today':
                selectedDateRange.value = {
                    start: currentDate,
                    end: currentDate
                }
                break;
            case 'yesterday':
                selectedDateRange.value = {
                    start: currentDate.subtract({
                        days: 1
                    }),
                    end: currentDate.subtract({
                        days: 1
                    })
                }
                break;
            case 'last-week':
                selectedDateRange.value = {
                    start: startOfWeek(currentDate, 'ph').subtract({
                        weeks: 1
                    }),
                    end: endOfWeek(currentDate, 'ph').subtract({
                        weeks: 1
                    })
                }
                break;
            case 'this-week':
                selectedDateRange.value = {
                    start: startOfWeek(currentDate, 'ph'),
                    end: endOfWeek(currentDate, 'ph')
                }
                break;
            case 'last-month':
                selectedDateRange.value = {
                    start: startOfMonth(currentDate).subtract({
                        months: 1
                    }),
                    end: endOfMonth(currentDate).subtract({
                        months: 1
                    })
                }
                break;
            case 'this-month':
                selectedDateRange.value = {
                    start: startOfMonth(currentDate),
                    end: endOfMonth(currentDate)
                }
        }
    }
})

watchEffect(() => {
    if (openRangeDate.value) {
        selectedDate.value = 'custom'
    }
})

watch(selectedDateRange, (newValue) => {
    if (newValue && newValue.start && newValue.end) {
        openRangeDate.value = false
        emits('select', newValue)
    }
})
</script>

<template>
    <div>
        <div class="flex w-fit border rounded-md overflow-hidden" v-if="!loading">
            <Select v-model="selectedDate">
                <SelectTrigger class="w-[10rem] border-none p-0 h-6 self-center rounded-none mx-3" :disabled="disabled">
                    <SelectValue class="text-xs font-medium" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
            </Select>
            <div>
                <Separator orientation="vertical" />
            </div>
            <Popover v-model:open="openRangeDate">
                <PopoverTrigger>
                    <Button variant="ghost" size="icon" class="rounded-none" :class="{ 'bg-primary': openRangeDate }"
                        :disabled="disabled">
                        <CalendarRange
                            :class="{ 'stroke-white': openRangeDate, 'stroke-muted-foreground': !openRangeDate }" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-fit" align="end">
                    <RangeCalendar v-model="selectedDateRange" />
                </PopoverContent>
            </Popover>
        </div>
        <Skeleton class="h-10 w-[13rem]" v-else />
    </div>

</template>



<style scoped></style>