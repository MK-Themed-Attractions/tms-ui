<script setup lang="ts">
import type { Worker, WorkerForm } from "@/types/workers";
import { displayColumns } from "../data";

import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/app/data-table";
import { Ellipsis, ScanQrCodeIcon } from "lucide-vue-next";
import { ButtonApp } from "@/components/app/button";
import WorkerDataTableAction from "./WorkerDataTableAction.vue";
import WorkerDialog from "./WorkerDialog.vue";
import { ref } from "vue";
import { DialogTitle } from "@/components/ui/dialog";

const props = defineProps<{
  workers: Worker[];
}>();
const { handleWorkerUpdate, updateDialog, updateValues } = useUpdate();

function useUpdate() {
  const updateDialog = ref(false);
  const updateValues = ref<Worker>();

  function handleWorkerUpdate(worker: Worker) {
    updateValues.value = worker;
    updateDialog.value = true;
  }

  return {
    updateDialog,
    handleWorkerUpdate,
    updateValues,
  };
}
</script>
<template>
  <div>
    <DataTable v-if="workers" :items="workers" :columns="displayColumns">
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

      <template #item.actions="{ item }">
        <WorkerDataTableAction :worker="item" @update="handleWorkerUpdate">
          <ButtonApp size="icon" variant="ghost">
            <Ellipsis />
          </ButtonApp>
        </WorkerDataTableAction>
      </template>
    </DataTable>

    <WorkerDialog v-model="updateDialog" :worker="updateValues">
      <template #header.title>
        <DialogTitle>Update Worker</DialogTitle>
      </template>
    </WorkerDialog>
  </div>
</template>

<style scoped></style>
