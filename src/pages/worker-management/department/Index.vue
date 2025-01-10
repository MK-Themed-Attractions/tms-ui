<script setup lang="ts">
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import { storeToRefs } from "pinia";
import DepartmentDataTable from "./components/DepartmentDataTable.vue";
import DepartmentToolbar from "./components/DepartmentToolbar.vue";

const { fetchDepartments, departments } = useWorkerDepartment();

if (!departments.value) await fetchDepartments();

function useWorkerDepartment() {
  const workerDepartmentStore = useWorkerDepartmentStore();
  const { departments, errors, loading } = storeToRefs(workerDepartmentStore);

  async function fetchDepartments() {
    await workerDepartmentStore.getDepartments();
  }

  return {
    fetchDepartments,
    departments,
  };
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Workers Department</h1>
      <p class="w-[70ch] text-sm text-muted-foreground md:text-base">
        Manage workers' departments, edit their details, update information, or
        delete entries. View a list of all workers in a selected department.
      </p>
    </div>

    <div class="lg:max-w-[50%]">
      <DepartmentToolbar class="mb-4" />

      <DepartmentDataTable v-if="departments" :departments="departments">
      </DepartmentDataTable>
    </div>
  </div>
</template>

<style scoped></style>
