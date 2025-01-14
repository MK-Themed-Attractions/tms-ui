<script setup lang="ts">
import { useWorkerStore } from "@/stores/workerStore";
import { storeToRefs } from "pinia";
import WorkerDataTable from "./components/WorkerDataTable.vue";

import WorkerToolbar from "./components/WorkerToolbar.vue";
import { provide } from "vue";
import { workerOnSuccessKey } from "@/lib/injectionKeys";
import { useRouterQuery } from "@/composables/useRouterQuery";
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";

const { fetchWorkers, workers, loading } = useWorkers();
const { handleSearch, q } = useSearch();
const { departments, fetchWorkerDepartments } = useWorkerDepartment();

function useWorkers() {
  const workerStore = useWorkerStore();
  const { workers, loading } = storeToRefs(workerStore);

  async function fetchWorkers() {
    await workerStore.getWorkers({
      params: { q: q.value, includes: "department" },
    });
  }

  return {
    fetchWorkers,
    workers,
    loading,
  };
}

function useWorkerDepartment() {
  const workerDepartmentStore = useWorkerDepartmentStore();
  const { departments } = storeToRefs(workerDepartmentStore);

  async function fetchWorkerDepartments() {
    if (!departments.value) await workerDepartmentStore.getDepartments();
  }

  return {
    fetchWorkerDepartments,
    departments,
  };
}

function useSearch() {
  /* Search query URL */
  const [q, setQ] = useRouterQuery("q", async () => {
    await fetchWorkers();
  });

  function handleSearch(search: string) {
    setQ(search);
  }
  return {
    q,
    handleSearch,
  };
}

/**
 * use to provide a central fetching function
 * everytime a CRUD happens to any child component
 */
provide(workerOnSuccessKey, async () => {
  await fetchWorkers();
});

/* INIT */
if (!workers.value) await fetchWorkers();
if (!departments.value) await fetchWorkerDepartments();
</script>

<template>
  <div class="container space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Worker Management</h1>
      <p class="w-[70ch] text-sm text-muted-foreground md:text-base">
        Manage workers with ease-view details, assign departments, update
        information, or remove workers seamlessly.
      </p>
    </div>

    <div class="space-y-4">
      <WorkerToolbar
        @search="handleSearch"
        :loading="loading"
        :search-default-value="q?.toString()"
      />
      <WorkerDataTable
        v-if="workers"
        :workers="workers"
        class="rounded-lg border shadow-sm"
      >
      </WorkerDataTable>
    </div>
  </div>
</template>

<style scoped></style>
