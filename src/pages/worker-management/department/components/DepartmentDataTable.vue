<script setup lang="ts">
import { DataTable } from "@/components/app/data-table";
import type { WorkerDepartment } from "@/types/workers";
import { displayColumns } from "../data";
import { TableCell } from "@/components/ui/table";
import { ButtonApp } from "@/components/app/button";
import { Ellipsis } from "lucide-vue-next";

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

      <template #item.actions="{ item }">
        <TableCell>
          <ButtonApp size="icon" variant="ghost" class="h-6 w-6">
            <Ellipsis />
          </ButtonApp>
        </TableCell>
      </template>

      <!-- @vue-ignore -->
      <template v-for="(_, slotName) in $slots" #[slotName] :key="slotName">
        <slot :name="slotName"></slot>
      </template>
      
    </DataTable>
  </div>
</template>

<style scoped></style>
