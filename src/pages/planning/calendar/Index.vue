<script setup lang="ts">
import { SectionHeader } from '@/components/app/section-header';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, DateSelectArg, EventClickArg, EventSourceInput } from '@fullcalendar/core/index.js';
import { getRandomColor } from '@/lib/utils';
import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { usePlanStore } from '@/stores/planStore';
import { computed, ref, useTemplateRef } from 'vue';
import type { PlanCalendar } from '@/types/planning';
import DepartmentToolbar from './components/DepartmentToolbar.vue';
import { Skeleton } from '@/components/ui/skeleton';
import type { WorkerDepartment } from '@/types/workers';
import type { ProductRoutingWorkCenterType } from '@/types/products';
import { storeToRefs } from 'pinia';
import { EmptyResource } from '@/components/app/empty-resource';
import { CalendarDays } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import CalendarEventDialog from './components/CalendarEventDialog.vue';

const planStore = usePlanStore()
const { loading: planLoading } = storeToRefs(planStore)
const planCalendarData = ref<PlanCalendar[]>()
const originalPlanCalendarData = ref<PlanCalendar[]>() // This will be used to store the original data for filtering
const { selectedPlanCalendar, showPlanCalendarDialog, handleEventClick } = usePlanCalendarDialog()
const { fetchPlanCalendar, handleDepartmentChange } = usePlanCalendar()
const dateWasFetched = ref(false)
const searchPlan = ref('')

function getPlanEvents(): EventSourceInput | undefined {
    if (!planCalendarData.value) return undefined;

    return planCalendarData.value.map<EventSourceInput>((event) => {
        return {
            title: event.plan_data.code,
            start: parseDate(event.start_date.split('T')[0]).add({ days: 1 }).toString(),
            end: parseDate(event.end_date.split('T')[0]).add({ days: 1 }).toString(),
            backgroundColor: getRandomColor(),
            borderColor: 'transparent',
            data: event,
        }
    }) as EventSourceInput
}

const calendarOptions = computed<CalendarOptions | undefined>(() => {
    if (!planCalendarData.value) return undefined;
    return {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        dayHeaderClassNames: 'text-sm font-medium',
        events: getPlanEvents(),
        eventClick: handleEventClick,
        dayMaxEventRows: true,
        datesSet: (args) => {
            const currentDate = parseDate(args.view.activeStart.toISOString().split('T')[0]).add({
                months: 1
            })
            if (dateWasFetched.value)
                fetchPlanCalendar(currentDate.month, currentDate.year)
            dateWasFetched.value = true;
        }
    }
})

async function handleSearchPlan() {
    if (searchPlan.value.trim() === '' || !planCalendarData.value) {
        planCalendarData.value = originalPlanCalendarData.value // Reset to original data if search is empty
        return;
    };

    planCalendarData.value = planCalendarData.value.filter((plan) => {
        return plan.plan_data.code.toLowerCase().includes(searchPlan.value.toLowerCase())
    })

    if (!planCalendarData.value.length) {
        toast.info('No results found', {
            description: 'Please try a different search term.',
        })
        planCalendarData.value = originalPlanCalendarData.value // Reset to original data if no results found
    }

}

function usePlanCalendarDialog() {
    const showPlanCalendarDialog = ref(false)
    const selectedPlanCalendar = ref<PlanCalendar>()

    function handleShowPlanCalendarDialog(planCalendar: PlanCalendar) {
        selectedPlanCalendar.value = planCalendar;
        showPlanCalendarDialog.value = true
    }

    function handleEventClick(info: EventClickArg) {
        const selectedEvent = info.event.extendedProps.data as PlanCalendar;
        handleShowPlanCalendarDialog(selectedEvent)
    }


    return {
        showPlanCalendarDialog,
        selectedPlanCalendar,
        handleShowPlanCalendarDialog,
        handleEventClick
    }
}

function usePlanCalendar() {
    const selectedDepartment = ref<WorkerDepartment>()

    async function fetchPlanCalendar(month: number, year: number) {
        if (!selectedDepartment.value) {
            console.warn('no department selected')
            return;
        }

        planCalendarData.value = await planStore.getPlanCalendar({
            "work-center": <ProductRoutingWorkCenterType[]>selectedDepartment.value.work_centers,
            month,
            year,
        })
        originalPlanCalendarData.value = planCalendarData.value // Store the original data for filtering
    }

    async function handleDepartmentChange(department: WorkerDepartment) {
        selectedDepartment.value = department;

        const currentDate = today(getLocalTimeZone())
        await fetchPlanCalendar(currentDate.month, currentDate.year)
    }

    return {
        handleDepartmentChange,
        fetchPlanCalendar
    }
}



</script>
<template>
    <div class="container space-y-6 ">
        <SectionHeader title="Plan Calendar" class=""
            description="Gain insights into the upcoming plan and explore detailed information about it." />

        <Suspense>
            <DepartmentToolbar @change="handleDepartmentChange" :loading="planLoading" />
            <template #fallback>
                <Skeleton class="h-10" />
            </template>
        </Suspense>
        <div class="relative isolate">
            <Search class="absolute size-4 text-muted-foreground top-1/2 -translate-y-1/2 left-2" />
            <Input class="pl-8" placeholder="Search for plans..." @keydown.enter="handleSearchPlan"
                v-model="searchPlan" />
        </div>
        <FullCalendar v-if="calendarOptions" :options="calendarOptions" ref="calendarRef" />
        <div v-else-if="!calendarOptions">
            <EmptyResource title="Select a department"
                description="Start viewing the plan calendar by selecting a department" :icon="CalendarDays" />
        </div>
        <div v-else class="flex justify-between flex-wrap">
            <Skeleton class="w-[15rem] h-10" />
            <Skeleton class="h-10 w-[8rem]" />

            <Skeleton class="mt-10 h-[80vh] grow basis-full" />
        </div>

        <CalendarEventDialog v-model="showPlanCalendarDialog" v-if="selectedPlanCalendar"
            :plan-calendar="selectedPlanCalendar" />
    </div>
</template>


<style scoped></style>