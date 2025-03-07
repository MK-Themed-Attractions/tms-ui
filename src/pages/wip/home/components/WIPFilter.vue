<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { getIconByTaskStatus } from '@/lib/utils';
import type { TaskStatus } from '@/types/wip';
import { LoaderCircle, X } from 'lucide-vue-next';

const props = defineProps<{
    loading?: boolean

}>()
const selectedFilter = defineModel<TaskStatus>()

const filters: { key: TaskStatus, value: string }[] = [
    { key: 'unassigned', value: 'Unassigned' },
    { key: 'pending', value: 'Pending' },
    { key: 'ongoing', value: 'Ongoing' },
    { key: 'paused', value: 'Paused' },
    { key: 'done', value: 'Done' },
    { key: 'qc-passed', value: 'QC Passed' },
]

</script>
<template>
    <div class="relative isolate flex flex-wrap border rounded-md w-fit overflow-hidden">
        <div class="absolute inset-0 z-10 bg-white/50" v-if="loading">
        </div>
        <ButtonApp v-for="filter in filters" :key="filter.key"
            :variant="selectedFilter === filter.key ? 'default' : 'none'"
            :prepend-icon="getIconByTaskStatus(filter.key)" class="rounded-none text-xs"
            @click="selectedFilter = filter.key">
            {{ filter.value }}
        </ButtonApp>
        <ButtonApp variant="secondary" :prepend-icon="X" class="rounded-none text-xs ml-auto border"
            v-if="selectedFilter" @click="selectedFilter = undefined">
            Clear
        </ButtonApp>
    </div>
</template>



<style scoped></style>