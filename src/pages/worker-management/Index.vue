<script setup lang="ts">
import { useWorkerStore } from "@/stores/workerStore";
import { storeToRefs } from "pinia";
import WorkerDataTable from "./components/WorkerDataTable.vue";

import WorkerToolbar from "./components/WorkerToolbar.vue";

const { fetchWorkers, workers } = useWorkers();

if (!workers.value) await fetchWorkers();

function useWorkers() {
  const workerStore = useWorkerStore();
  const { workers } = storeToRefs(workerStore);

  async function fetchWorkers() {
    await workerStore.getWorkers();
  }

  return {
    fetchWorkers,
    workers,
  };
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Worker Management</h1>
      <p class="w-[70ch] text-sm text-muted-foreground md:text-base">
        Manage workers with ease-view details, assign departments, update
        information, or remove workers seamlessly.
      </p>
    </div>

    <div class="space-y-4 lg:max-w-[70%]">
      <WorkerToolbar />
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
