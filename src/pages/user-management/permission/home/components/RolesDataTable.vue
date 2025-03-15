<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { TableCell, TableHead, TableHeader } from '@/components/ui/table';
import type { Role } from '@/types/auth';


const props = defineProps<{
    roles: Role[]
}>()
</script>
<template>
    <DataTable :items="roles">
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
    </DataTable>
</template>



<style scoped></style>