<script setup lang="ts">
import { FilterApp } from '@/components/app/filter';
import type { StatusFilter } from './data';

const filters: StatusFilter[] = [
    {
        name: 'pending',
        id: '1'
    },
    {
        name: 'ongoing',
        id: '2'
    },
    {
        name: 'finished',
        id: '3'
    },
]
const selected = defineModel<StatusFilter[]>()

</script>

<template>
    <FilterApp v-model="selected" :items="filters" text="Status" />
</template>



<style scoped></style>