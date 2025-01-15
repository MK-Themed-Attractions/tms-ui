<script setup lang="ts">
import type { Worker, WorkerForm } from "@/types/workers";
import { displayColumns } from "../data";

import { TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/app/data-table";
import { Dot, Ellipsis, ScanQrCodeIcon } from "lucide-vue-next";
import { ButtonApp } from "@/components/app/button";
import WorkerDataTableAction from "./WorkerDataTableAction.vue";
import WorkerDialog from "./WorkerDialog.vue";
import { inject, ref } from "vue";
import { DialogTitle } from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/app/confirmation-dialog";
import { useWorkerStore } from "@/stores/workerStore";
import { toast } from "vue-sonner";
import { storeToRefs } from "pinia";
import { workerOnSuccessKey } from "@/lib/injectionKeys";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{
  workers: Worker[];
}>();
const { handleWorkerUpdate, updateDialog, updateValues } = useUpdate();
const { deactivateDialog, handleShowDeactivateDialog, handleDeactivateWorker } =
  useDeactivate();
const onSuccess = inject(workerOnSuccessKey);
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

function useDeactivate() {
  const deactivateDialog = ref(false);
  const selectedWorkerToDeactivate = ref<Worker>();
  const workerStore = useWorkerStore();
  const { errors } = storeToRefs(workerStore);

  function handleShowDeactivateDialog(worker: Worker) {
    deactivateDialog.value = true;
    selectedWorkerToDeactivate.value = worker;
  }
  async function handleDeactivateWorker() {
    if (selectedWorkerToDeactivate.value) {
      await workerStore.deactivateWorker([selectedWorkerToDeactivate.value]);

      /* Show toast for success and failed deactivation */
      if (!errors.value)
        toast("Success", {
          description: "Worker has been deactivated.",
        });
      else
        toast("Error", {
          description: "Something went wrong.",
        });

      /* close the dialog  */
      deactivateDialog.value = false;

      /* refetch the workers */
      if (onSuccess) await onSuccess();
    }
  }

  return {
    deactivateDialog,
    handleShowDeactivateDialog,
    handleDeactivateWorker,
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
          <div
            variant="outline"
            class="flex items-center gap-2"
            v-if="item.rfid_card"
          >
            <ScanQrCodeIcon :size="15" class="stroke-muted-foreground" />
            <span>{{ item.rfid_card }}</span>
          </div>
        </TableCell>
      </template>

      <template #item.status="{ item }">
        <TableCell>
          <Badge class="py-0 flex w-fit items-center" variant="outline">
            <Dot
              :class="{
                'stroke-green-500': item.rfid_card,
                'stroke-destructive': !item.rfid_card,
              }"
            />
            <span class="text-muted-foreground">{{
              item.rfid_card ? "active" : "inactive"
            }}</span>
          </Badge>
        </TableCell>
      </template>
      <template #item.actions="{ item }">
        <WorkerDataTableAction
          :worker="item"
          @update="handleWorkerUpdate"
          @deactivate="handleShowDeactivateDialog"
        >
          <ButtonApp size="icon" variant="ghost">
            <Ellipsis class="stroke-muted-foreground" />
          </ButtonApp>
        </WorkerDataTableAction>
      </template>
    </DataTable>

    <!-- Dialog for updating the worker -->
    <WorkerDialog v-model="updateDialog" :worker="updateValues">
      <template #header.title>
        <DialogTitle>Update Worker</DialogTitle>
      </template>
    </WorkerDialog>

    <!-- Dialog for deactivation -->
    <ConfirmationDialog
      title="Warning"
      description="Deactivating a worker means supervisor's can not view this worker in their dashboard anymore"
      v-model:open="deactivateDialog"
      @yes="handleDeactivateWorker"
    >
      Are you sure you want to deactivate this worker?
    </ConfirmationDialog>
  </div>
</template>

<style scoped></style>
