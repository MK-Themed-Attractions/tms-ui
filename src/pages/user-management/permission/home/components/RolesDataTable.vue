<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { TableCell, TableHead } from '@/components/ui/table';
import type { Role } from '@/types/auth';
import { rolesDataTableColumns } from '..';


const props = defineProps<{
    roles: Role[]
}>()
</script>
<template>
    <DataTable :items="roles" :columns="rolesDataTableColumns">
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
            <TableCell class="font-medium capitalize">
                {{ item.name }}
            </TableCell>
        </template>
        <template #item.actions="{ item }">
            <TableCell>
                <slot name="actions" :item="item" />
            </TableCell>
        </template>
    </DataTable>
</template>



<style scoped></style>