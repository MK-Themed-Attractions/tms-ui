<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import type { WipTask } from '@/types/wip';
import { qcTaskDataTableColumn } from '../data';
import Badge from '@/components/ui/badge/Badge.vue';
import { formatReadableDate, getIconByTaskStatus } from '@/lib/utils';
import { TableCell } from '@/components/ui/table';

const props = defineProps<{
    tasks: WipTask[]
}>()

</script>
<template>
    <DataTable :items="tasks" :columns="qcTaskDataTableColumn">
        <template #item.id="{ item }">
            <TableCell>
                <span class="uppercase">{{ item.id }}</span>
            </TableCell>
        </template>
        <template #item.status="{ item }">
            <TableCell>
                <Badge class="gap-1" variant="secondary">
                    <component :is="getIconByTaskStatus(item.status)" class="size-4" /> <span class="capitalize">{{
                        item.status }}</span>
                </Badge>
            </TableCell>
        </template>

        <template #item.qc_passed_at="{ item }">
            <TableCell v-if="item.qc_passed_at">
                <span>{{ formatReadableDate(item.qc_passed_at) }}</span>
            </TableCell>
        </template>
        <template #item.qc_failed_at="{ item }">
            <TableCell v-if="item.qc_failed_at">
                <span>{{ formatReadableDate(item.qc_failed_at) }}</span>
            </TableCell>
        </template>

        <!-- @vue-ignore -->
        <template v-for="(_, slotName) in $slots" #[slotName]="{ item }" :key="slotName">

            <slot :name="slotName" :item="item"></slot>
        </template>
    </DataTable>
</template>


<style scoped></style>