<script setup lang="ts">
import { SectionHeader } from '@/components/app/section-header';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDate } from '@internationalized/date';

const pepe = [
    {
        data: 'a',
        startDate: new CalendarDate(2025, +'04', +'2'),
        endDate: new CalendarDate(2025, 0o4, +'3'),
        color: '#f43f5e'
    },
    {
        data: 'f',
        startDate: new CalendarDate(2025, +'04', +'7'),
        endDate: new CalendarDate(2025, +'04', +'9'),
        color: '#d6d3d1'
    },
    {
        data: 'b',
        startDate: new CalendarDate(2025, +'04', +'2'),
        endDate: new CalendarDate(2025, 0o4, +'10'),
        color: '#86efac'
    },
    {
        data: 'c',
        startDate: new CalendarDate(2025, +'04', +'1'),
        endDate: new CalendarDate(2025, 0o4, +'2'),
        color: '#60a5fa'
    },
    {
        data: 'd',
        startDate: new CalendarDate(2025, +'04', +'7'),
        endDate: new CalendarDate(2025, +'05', +'23'),
        color: '#fdba74'
    },
    {
        data: 'e',
        startDate: new CalendarDate(2025, +'04', +'1'),
        endDate: new CalendarDate(2025, +'04', +'1'),
        color: '#d8b4fe'
    },
    {
        data: 'q',
        startDate: new CalendarDate(2025, +'04', +'1'),
        endDate: new CalendarDate(2025, +'04', +'3'),
        color: '#d6d3d1'
    },
    {
        data: 'z',
        startDate: new CalendarDate(2025, +'04', +'3'),
        endDate: new CalendarDate(2025, +'04', +'4'),
        color: '#d6d3d1'
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