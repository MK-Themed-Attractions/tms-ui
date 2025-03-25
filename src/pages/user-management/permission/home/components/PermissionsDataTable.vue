<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { TableCell, TableHead } from '@/components/ui/table';
import type { Permission } from '@/types/auth';
import { permissionDataTableColumns } from '..';

const props = defineProps<{
    permissions: Permission[]
}>()
</script>
<template>
    <DataTable :items="permissions" :columns="permissionDataTableColumns">
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
        <template #item.description="{ item }">
            <TableCell>
                <em>
                    {{ item.description }}
                </em>
            </TableCell>
        </template>
        <template #item.actions="{ item }">
            <TableCell>
                <slot name="actions" :item="item" />
            </TableCell>
        </template>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </DataTable>
</template>


<style scoped></style>