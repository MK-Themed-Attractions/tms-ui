<script setup lang="ts">
import { SectionHeader } from '@/components/app/section-header';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDate } from '@internationalized/date';

const pepe = [
    {
        data: 'a',
        startDate: new CalendarDate(2025, +'04', +'2'),
        endDate: new CalendarDate(2025, 0o4, +'3'),
    },
    {
        data: 'f',
        startDate: new CalendarDate(2025, +'04', +'7'),
        endDate: new CalendarDate(2025, +'04', +'9'),
    },
    {
        data: 'b',
        startDate: new CalendarDate(2025, +'04', +'2'),
        endDate: new CalendarDate(2025, 0o4, +'10'),

    },
    {
        data: 'c',
        startDate: new CalendarDate(2025, +'04', +'1'),
        endDate: new CalendarDate(2025, 0o4, +'2'),

    },
    {
        data: 'd',
        startDate: new CalendarDate(2025, +'04', +'7'),
        endDate: new CalendarDate(2025, +'05', +'23'),

    },
    {
        data: 'e',
        startDate: new CalendarDate(2025, +'04', +'1'),
        endDate: new CalendarDate(2025, +'04', +'1'),

    },
    {
        data: 'q',
        startDate: new CalendarDate(2025, +'04', +'1'),
        endDate: new CalendarDate(2025, +'04', +'3'),

    },
    {
        data: 'z',
        startDate: new CalendarDate(2025, +'04', +'3'),
        endDate: new CalendarDate(2025, +'04', +'4'),

    },
    {
        data: 'r',
        startDate: new CalendarDate(2025, +'04', +'10'),
        endDate: new CalendarDate(2025, +'04', +'11'),

    },

]
const q = pepe.find((e) => e.data === 'q')
const z = pepe.find((e) => e.data === 'a')
// console.log(z!.startDate.compare(q!.endDate) <= 0 && z!.endDate.compare(q!.startDate) >= 0)
</script>
<template>
    <div class="container space-y-6 ">
        <SectionHeader title="Plan Calendar" class=""
            description="Gain insights into the upcoming plan and explore detailed information about it." />
        <Calendar :events="pepe" />
    </div>
</template>


<style scoped></style>