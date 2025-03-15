<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { TableCell, TableHead } from '@/components/ui/table';
import type { Permission } from '@/types/auth';

const props = defineProps<{
    permissions: Permission[]
}>()
</script>
<template>
    <DataTable :items="permissions">
        <template #header.id="{ item }">
            <TableHead>
                UUID
            </TableHead>
        </template>
        <template #item.id="{ item }">
            <TableCell class="uppercase">
                {{ item.id }}
            </TableCell>
        </template>
        <template #item.name="{ item }">
            <TableCell>
                <span class="font-medium rounded-md border px-1">
                    {{ item.name }}
                </span>
            </TableCell>
        </template>
    </DataTable>
</template>


<style scoped></style>