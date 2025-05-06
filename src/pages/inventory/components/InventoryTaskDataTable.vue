<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import type { WipTask } from '@/types/wip';
import { inventoryTaskDataTableColumns } from '../data';
import { TableCell } from '@/components/ui/table';
import { formatReadableDate, getIconByTaskStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { InventoryAllocatedBom } from '@/types/inventory';
import { computed } from 'vue';
import { CheckCircle, XCircle } from 'lucide-vue-next';

const props = defineProps<{
    tasks: WipTask[],
    allocatedBoms?: InventoryAllocatedBom[]
}>()

function isTaskHasBomAllocated(planTaskId: string) {
    return computed(() => props.allocatedBoms?.some(ab => ab.plan_task_id === planTaskId))
}
</script>
<template>
    <DataTable :items="tasks" :columns="inventoryTaskDataTableColumns">


        <template #item.workcenter.name="{ item }">
            <TableCell>
                <span class="font-medium">{{ item.workcenter.name }}</span>
            </TableCell>
        </template>
        <template #item.status="{ item }">
            <TableCell>
                <Badge variant="secondary" class="inline-flex items-center gap-2">
                    <component :is="getIconByTaskStatus(item.status)" class="size-4 text-muted-foreground"></component>
                    <span>{{ item.status }}</span>
                </Badge>
            </TableCell>
        </template>
        <template #item.can_access_at="{ item }">
            <TableCell>
                <span>{{ formatReadableDate(item.can_accessed_at) }}</span>
            </TableCell>
        </template>
        <template #item.allocate_bom="{ item }">
            <TableCell>
                <component :is="isTaskHasBomAllocated(item.task_plan_id).value ? CheckCircle : XCircle"
                    class="size-4 text-muted-foreground"></component>
            </TableCell>
        </template>

        <!-- @vue-ignore -->
        <!-- @vue-skip -->
        <template v-for="(_, slotName) in $slots" #[slotName]="{ item }" :key="slotName">
            <slot :name="slotName" :item="item"></slot>
        </template>
    </DataTable>
</template>



<style scoped></style>