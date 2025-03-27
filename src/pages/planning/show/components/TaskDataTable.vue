<script setup lang="ts">
import { formatReadableDate } from "@/lib/utils";
import { taskColumns } from "./data";
import type { BatchTask } from "@/types/planning";
import { DataTable } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import { EllipsisVertical, History } from "lucide-vue-next";
import { ButtonApp } from "@/components/app/button";
import type { RouteLocationAsRelativeGeneric } from "vue-router";

const props = defineProps<{
  tasks: BatchTask[];
}>();
function taskHistory(item: BatchTask) {
  return {
    name: 'taskHistoryIndex',
    query: {
      workCenter: item.current_operation_data.operation_code,
      batch: item.batch_id,
      task: item.id,
      q: item.id,
    }
  } as RouteLocationAsRelativeGeneric
}

</script>

<template>
  <DataTable :items="tasks" :columns="taskColumns">
    <template #item.start_date="{ item }">
      <TableCell>
        {{ formatReadableDate(item.start_date) }}
      </TableCell>
    </template>
    <template #item.current_operation_data.runtime="{ item }">
      <TableCell>
        {{ item.current_operation_data.runtime.toLocaleString() }}
        <span class="text-muted-foreground"> min(s)</span>
      </TableCell>
    </template>

    <template #item.actions="{ item }">
      <TableCell>
        <ButtonApp size="icon" variant="ghost" class="h-6 w-6" as-child>
          <RouterLink :to="taskHistory(item)" target="_blank">
            <History />
          </RouterLink>
        </ButtonApp>
      </TableCell>
    </template>
  </DataTable>
</template>

<style scoped></style>
