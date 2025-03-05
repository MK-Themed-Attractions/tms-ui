<script setup lang="ts">
import { DataTable } from "@/components/app/data-table";
import type { WorkerDepartment } from "@/types/workers";
import { displayColumns } from "../data";
import { TableCell } from "@/components/ui/table";
import { ButtonApp } from "@/components/app/button";
import { Ellipsis } from "lucide-vue-next";
import DepartmentDataTableAction from "./DepartmentDataTableAction.vue";
import { ref } from "vue";
import DepartmentDialog from "./DepartmentDialog.vue";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

const props = defineProps<{
  departments: WorkerDepartment[];
}>();

const { handleWorkerDepartmentUpdate, updateDialog, updateValues } =
  useUpdate();

function useUpdate() {
  const updateDialog = ref(false);
  const updateValues = ref<WorkerDepartment>();

  function handleWorkerDepartmentUpdate(selected: WorkerDepartment) {
    updateValues.value = selected;
    updateDialog.value = true;
  }

  return {
    handleWorkerDepartmentUpdate,
    updateValues,
    updateDialog,
  };
}
</script>
<template>
  <div class="rounded-lg border shadow-sm">
    <DataTable v-if="departments" :items="departments" :columns="displayColumns">
      <template #item.code="{ item }">
        <TableCell>
          <span class="rounded-md border px-2 text-xs font-medium uppercase">
            {{ item.code }}
          </span>
        </TableCell>
      </template>
      <template #item.work_centers="{ item }">
        <TableCell class="flex gap-1">
          <span class="rounded-md border px-2 text-xs font-medium uppercase" v-for="wc in item.work_centers">
            {{ wc }}
          </span>
        </TableCell>
      </template>

      <template #item.actions="{ item }">
        <TableCell>
          <DepartmentDataTableAction :worker-department="item" @update="handleWorkerDepartmentUpdate">
            <ButtonApp size="icon" variant="ghost" class="h-6 w-6">
              <Ellipsis class="stroke-muted-foreground" />
            </ButtonApp>
          </DepartmentDataTableAction>
        </TableCell>
      </template>

      <!-- @vue-ignore -->
      <template v-for="(_, slotName) in $slots" #[slotName] :key="slotName">
        <slot :name="slotName"></slot>
      </template>
    </DataTable>

    <Teleport to="#overlay">
      <!-- Department Update -->
      <DepartmentDialog v-model="updateDialog" :worker-department="updateValues">
        <template #header.title>
          <DialogTitle> Update department </DialogTitle>
        </template>
        <template #header.description>
          <DialogDescription>
            Update the department information. Click save when your're done.
          </DialogDescription>
        </template>
      </DepartmentDialog>
    </Teleport>
  </div>
</template>

<style scoped></style>
