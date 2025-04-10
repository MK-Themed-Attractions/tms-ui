<script setup lang="ts">
import { cn, getRandomColor } from '@/lib/utils'
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, type CalendarEventConcreteData } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type DateValue, getLocalTimeZone, today, isToday, CalendarDate } from '@internationalized/date'
import { useElementBounding, useVModel } from '@vueuse/core'
import { CalendarRoot, type CalendarRootEmits, type CalendarRootProps, useDateFormatter, useForwardPropsEmits } from 'reka-ui'
import { createDecade, createYear, toDate } from 'reka-ui/date'
import { computed, ref, type HTMLAttributes, type Ref, } from 'vue'
import { ButtonApp } from '@/components/app/button'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Separator from '../separator/Separator.vue'
import CalendarEvent from './CalendarEvent.vue'
import type { CalendarEventData } from './index.ts'

const props = withDefaults(defineProps<CalendarRootProps & { events?: CalendarEventData[] } & { class?: HTMLAttributes['class'] }>(), {
  modelValue: undefined,
  placeholder() {
    return today(getLocalTimeZone())
  },
  weekdayFormat: 'short',
})
const emits = defineEmits<CalendarRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, placeholder: __, ...delegated } = props

  return delegated
})

const placeholder = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: today(getLocalTimeZone()),
}) as Ref<DateValue>

const month = computed(() => placeholder.value.month.toString())
const year = computed(() => placeholder.value.year.toString())

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const formatter = useDateFormatter('en')

/** Get the computed width and height of the first cell to apply it to the calendar event */
const cellContentRect = ref({ width: 0, height: 0 })

function checkCell(el: HTMLElement) {
  const { width, height } = useElementBounding(el)
  cellContentRect.value = {
    width: width.value,
    height: height.value
  }
}

const concreteEvents = computed(() => {
  if (!props.events || !props.events.length) return [];

  const sortedEvents = [...props.events];

  // Step 1: Sort events by start date first, then by longest span
  sortedEvents.sort((a, b) => {
    const startDateComparison = a.startDate.compare(b.startDate);
    if (startDateComparison !== 0) {
      return startDateComparison; // Sort by start date ascending
    }
    const durationA = a.endDate.compare(a.startDate) + 1;
    const durationB = b.endDate.compare(b.startDate) + 1;
    return durationB - durationA; // Sort by duration descending if start dates are equal
  });

  const result: CalendarEventConcreteData[] = [];

  // Step 2: Split events when encountering a Saturday
  function splitEvent(event: CalendarEventData) {
    let currentStart = event.startDate;
    const barColor = getRandomColor()

    while (currentStart.compare(event.endDate) <= 0) {
      let nextEnd = currentStart;

      // Move to the next Saturday or stop at event.endDate
      while (nextEnd.compare(event.endDate) <= 0 && nextEnd.toDate(getLocalTimeZone()).getDay() !== 6) {
        nextEnd = nextEnd.add({ days: 1 });
      }

      if (nextEnd.compare(event.endDate) > 0) {
        nextEnd = event.endDate;
      }

      result.push({
        ...event,
        color: barColor,
        startDate: currentStart,
        endDate: nextEnd,
        intersect: 0, // Will be calculated later
      });

      currentStart = nextEnd.add({ days: 1 });

      if (currentStart.compare(event.endDate) > 0) break;
    }
  }

  sortedEvents.forEach(event => splitEvent(event));

  // Step 3: Calculate the intersect property
  result.forEach((currentEvent, index) => {
    let intersectCount = 0;


    for (let i = 0; i < index; i++) {
      const higherSpanEvent = result[i];
      if (
        currentEvent.startDate.compare(higherSpanEvent.endDate) <= 0 &&
        currentEvent.endDate.compare(higherSpanEvent.startDate) >= 0
      ) {
        intersectCount++;
      }
    }

    // Assign the intersect count
    currentEvent.intersect = intersectCount;
  });

  return result;
});
</script>

<template>
  <CalendarRoot v-slot="{ date, grid, weekDays, }" v-model:placeholder="placeholder" v-bind="forwarded"
    :class="cn('rounded-md border p-3', props.class)">
    <CalendarHeader>
      <CalendarHeading class="flex flex-wrap justify-between gap-2 w-full ">
        <Select :model-value="month" @update:model-value="(v: number) => {
          if (!v || !placeholder) return;
          if (Number(v) === placeholder?.month) return;
          placeholder = placeholder.set({
            month: Number(v),
          })
        }">
          <SelectTrigger aria-label="Select month" class="max-w-[15rem]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent class="max-h-[200px]">
            <SelectItem v-for="month in createYear({ dateObj: date })" :key="month.toString()"
              :value="month.month.toString()">
              {{ formatter.custom(toDate(month), { month: 'long' }) }}
            </SelectItem>
          </SelectContent>
        </Select>

        <div class="border flex items-center rounded-md md:mr-auto">
          <ButtonApp size="icon" variant="ghost" class="rounded-none m-0 p-0" @click="() => {
            placeholder = placeholder.set({
              month: placeholder.month > 1 ? placeholder.month - 1 : 12,
              year: placeholder.month === 1 ? placeholder.year - 1 : placeholder.year
            })
          }">
            <ChevronLeft />
          </ButtonApp>
          <Separator orientation="vertical" />
          <ButtonApp size="icon" variant="ghost" class="rounded-none w-20" @click="() => {
            placeholder = today(getLocalTimeZone())
          }">Today</ButtonApp>
          <Separator orientation="vertical" />
          <ButtonApp size="icon" variant="ghost" class="rounded-none m-0 p-0" @click="() => {
            placeholder = placeholder.set({
              month: placeholder.month < 12 ? placeholder.month + 1 : 1,
              year: placeholder.month > 11 ? placeholder.year + 1 : placeholder.year
            })
          }">
            <ChevronRight />
          </ButtonApp>
        </div>

        <Select :model-value="year" @update:model-value="(v: number) => {
          if (!v || !placeholder) return;
          if (Number(v) === placeholder?.year) return;
          placeholder = placeholder.set({
            year: Number(v),
          })
        }">
          <SelectTrigger aria-label="Select year" class="max-w-[15rem]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent class="max-h-[200px]">
            <SelectItem v-for="yearValue in createDecade({ dateObj: date, startIndex: -10, endIndex: 10 })"
              :key="yearValue.toString()" :value="yearValue.year.toString()">
              {{ yearValue.year }}
            </SelectItem>
          </SelectContent>
        </Select>
      </CalendarHeading>
    </CalendarHeader>

    <div class="mt-1 lg:mt-2 overflow-x-auto overflow-y-hidden">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full mx-auto overflow-hidden">
        <CalendarGridHead>
          <CalendarGridRow class="flex gap-2 relative">
            <CalendarHeadCell v-for="day in weekDays" :key="day" class="text-start w-full">
              {{ day }}
            </CalendarHeadCell>

          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="flex gap-2 mt-2">
            <CalendarCell v-for="(weekDate, daysIndex) in weekDates" :key="weekDate.toString()" :date="weekDate"
              class="w-full h-[clamp(2rem,9vw,9rem)] bg-muted/20 rounded-md relative" :ref="(el: HTMLDivElement) => {
                if (index === 0 && daysIndex === 0)
                  checkCell(el)
              }">
              <CalendarCellTrigger :day="weekDate" :month="month.value" class="w-0 pointer-events-none" tab-index="-1">
                <span class="absolute top-2 right-2 text-primary size-6 grid place-content-center rounded-full"
                  :class="{ 'bg-primary text-white': isToday(weekDate) }">
                  {{ weekDate.day }}
                </span>

                <template v-for="(event, index) in concreteEvents" :key="`${event.data}-${event.startDate}`">
                  <CalendarEvent :anchor="cellContentRect" v-if="event.startDate.compare(weekDate) === 0"
                    :style="{ top: `${(20 * (event.intersect + 1)) + 20}px` }" :event="event" />
                </template>
              </CalendarCellTrigger>
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>