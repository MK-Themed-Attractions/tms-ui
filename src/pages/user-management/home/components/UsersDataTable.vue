<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import type { User } from '@/types/auth';
import { userDataTableColumns } from '..';
import { TableCell } from '@/components/ui/table';
import { computed, ref } from 'vue';


const props = defineProps<{
    users: User[]
}>()
</script>
<template>
    <DataTable :items="users" :columns="userDataTableColumns">
        <template #item.email="{ item }">
            <TableCell>
                <span class="font-medium">
                    {{ item.email }}
                </span>
            </TableCell>
        </template>
        <template #item.full_name="{ item }">
            <TableCell class="capitalize">
                {{ item.given_name }} {{ item.last_name }}
            </TableCell>
        </template>
        <template #item.id="{ item }">
            <TableCell class="uppercase">
                {{ item.id }}
            </TableCell>
        </template>
        <template #item.actions="{ item }">
            <TableCell class="uppercase">
                <slot name="actions" :item="item"></slot>
            </TableCell>
        </template>
    </DataTable>
</template>



<style scoped></style>