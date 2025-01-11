<script setup lang="ts">
import { DataTable } from "@/components/app/data-table";
import type { WorkerDepartment } from "@/types/workers";
import { displayColumns } from "../data";
import { TableCell } from "@/components/ui/table";

const props = defineProps<{
  departments: WorkerDepartment[];
}>();
</script>
<template>
  <div class="rounded-lg border shadow-sm">
    <DataTable
      v-if="departments"
      :items="departments"
      :columns="displayColumns"
    >
      <template #item.code="{ item }">
        <TableCell>
          <span class="rounded-md border px-2 text-xs font-medium uppercase">
            {{ item.code }}
          </span>
        </TableCell>
      </template>
    </DataTable>
  </div>
</template>

<style scoped></style>
