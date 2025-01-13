<script setup lang="ts">
import type { Worker } from "@/types/workers";
import { displayColumns } from "../data";

import { TableCell, TableHead } from "@/components/ui/table";
import { DataTable } from "@/components/app/data-table";
import { ScanQrCodeIcon } from "lucide-vue-next";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataTableChecks } from "@/composables/useDataTableChecks";

const props = defineProps<{
  workers: Worker[];
}>();

const { add, checkedItems, handleCheck, indicator, itemExists } =
  useDataTableChecks(props.workers);
</script>
<template>
  <div>
    <DataTable v-if="workers" :items="workers" :columns="displayColumns">
      <template #header.check="{ item }">
        <TableHead>
          <Checkbox
            @update:checked="handleCheck"
            :checked="indicator"
          ></Checkbox>
        </TableHead>
      </template>
      <template #item.check="{ item }">
        <TableCell>
          <Checkbox @click="add(item)" :checked="itemExists(item)"></Checkbox>
        </TableCell>
      </template>

      <template #item.worker_number="{ item }">
        <TableCell class="font-medium">{{ item.worker_number }}</TableCell>
      </template>

      <template #item.rfid_card="{ item }">
        <TableCell>
          <div variant="outline" class="flex items-center gap-2">
            <ScanQrCodeIcon :size="15" class="stroke-muted-foreground" />
            <span>{{ item.rfid_card }}</span>
          </div>
        </TableCell>
      </template>
    </DataTable>
  </div>
</template>

<style scoped></style>
