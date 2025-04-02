<script setup lang="ts">
import { SectionHeader } from '@/components/app/section-header';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDate } from '@internationalized/date';

const pepe = [
    {
        data: 'hehe',
        startDate: new CalendarDate(2025, +'04', +'4'),
        endDate: new CalendarDate(2025, 0o4, +'4')
    },
    {
        data: 'hehe',
        startDate: new CalendarDate(2025, +'04', +'4'),
        endDate: new CalendarDate(2025, 0o4, +'5')
    },
]
</script>
<template>
    <div class="container space-y-6">
        <SectionHeader title="Plan Calendar" class=""
            description="Gain insights into the upcoming plan and explore detailed information about it." />
        <Calendar :events="pepe" />
    </div>
</template>


<style scoped></style>