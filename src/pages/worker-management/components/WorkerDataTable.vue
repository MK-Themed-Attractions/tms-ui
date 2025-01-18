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
import {
  PaginationApp,
  type PaginationQuery,
} from "@/components/app/pagination";

const props = defineProps<{
  workers: Worker[];
}>();
const workerStore = useWorkerStore();
const { handleWorkerUpdate, updateDialog, updateValues } = useUpdate();
const { deactivateDialog, handleShowDeactivateDialog, handleDeactivateWorker } =
  useDeactivate();
const { handleQueryChange, hasNextPage, hasPrevPage } = usePaginate();
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

function usePaginate() {
  const { hasNextPage, hasPrevPage } = storeToRefs(workerStore);
  async function handleQueryChange(query: Partial<PaginationQuery>) {
    if (onSuccess) {
      await onSuccess({
        per_page: query.perPage ? +query.perPage : 30,
        page: query.page,
      });
    }
  }

  return {
    handleQueryChange,
    hasNextPage,
    hasPrevPage,
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

      <template #item.is_active="{ item }">
        <TableCell>
          <Badge class="flex w-fit items-center py-0" variant="outline">
            <Dot
              :class="{
                'stroke-green-500': item.is_active,
                'stroke-destructive': !item.is_active,
              }"
            />
            <span class="text-muted-foreground">{{
              item.is_active ? "active" : "inactive"
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

      <template #footer>
        <PaginationApp
          class="col-span-full"
          @change:query="handleQueryChange"
          :disable-prev="!hasPrevPage"
          :disable-next="!hasNextPage"
        ></PaginationApp>
      </template>
    </DataTable>

    <!-- Dialog for updating the worker -->
    <WorkerDialog v-model="updateDialog" :worker="updateValues">
      <template #header.title>
        <DialogTitle>Update Worker</DialogTitle>
      </template>
    </WorkerDialog>

    <Teleport to="#overlay">
      <!-- Dialog for deactivation -->
      <ConfirmationDialog
        title="Warning"
        description="Deactivating a worker means supervisor's can not view this worker in their dashboard anymore"
        v-model:open="deactivateDialog"
        @yes="handleDeactivateWorker"
      >
        Are you sure you want to deactivate this worker?
      </ConfirmationDialog>
    </Teleport>
  </div>
</template>

<style scoped></style>
