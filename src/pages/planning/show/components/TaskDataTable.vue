<script setup lang="ts">
import { formatReadableDate } from "@/lib/utils";
import { taskColumns } from "./data";
import type { BatchTask } from "@/types/planning";
import { DataTable } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import { EllipsisVertical } from "lucide-vue-next";
import { ButtonApp } from "@/components/app/button";

const props = defineProps<{
  tasks: BatchTask[];
}>();
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
        <ButtonApp size="icon" variant="ghost" class="h-6 w-6">
          <EllipsisVertical />
        </ButtonApp>
      </TableCell>
    </template>
  </DataTable>
</template>

<style scoped></style>
