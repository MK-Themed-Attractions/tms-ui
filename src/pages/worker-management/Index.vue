<script setup lang="ts">
import { useWorkerStore } from "@/stores/workerStore";
import { storeToRefs } from "pinia";
import WorkerDataTable from "./components/WorkerDataTable.vue";

import WorkerToolbar from "./components/WorkerToolbar.vue";
import { provide, ref } from "vue";
import { workerOnSuccessKey } from "@/lib/injectionKeys";
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import type { WorkerQueryParams } from "@/types/workers";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { usePermission } from "@/layouts/main/usePermission";
import type { FilterQueryParams } from "@/types/general";
import { useRouteQuery } from "@vueuse/router";

const { fetchWorkers, workers, loading } = useWorkers();
const { handleSearch, q } = useSearch();
const { departments, fetchWorkerDepartments } = useWorkerDepartment();
const route = useRoute();
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { isAdmin } = usePermission()
const page = useRouteQuery('page', 1, {
  transform: Number
})

const filters = ref<FilterQueryParams[]>([
  {
    column: "department_id",
    values: [],
  },
  {
    column: "is_active",
    values: [],
  },
  {
    column: "rfid_card",
    values: []
  }
])


function useWorkers() {
  const workerStore = useWorkerStore();
  const { workers, loading } = storeToRefs(workerStore);

  async function fetchWorkers(params?: Partial<WorkerQueryParams>) {

    /* when the user is not an admin , filter the workers by their department */
    if (!isAdmin(user.value.id)) {
      const hasNoDepartmentValue = filters.value.find(f => f.column === 'department_id' && f.values.length === 0)
      if (hasNoDepartmentValue) {
        return;
      }
    }
    await workerStore.getWorkers({
      q: q.value?.toString(),
      includes: "department",
      page: route.query.page ? +route.query.page : 1,
      per_page: route.query["per-page"] ? +route.query["per-page"] : 30,
      filters: filters.value,
      ...params,
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
  const q = useRouteQuery("q", "");

  async function handleSearch(search: string) {
    page.value = 1
    await fetchWorkers({
      page: page.value
    })
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
provide(workerOnSuccessKey, async (params?: Partial<WorkerQueryParams>) => {
  await fetchWorkers(params);
});

/* INIT */
if (!workers.value && isAdmin(user.value.id)) await fetchWorkers();
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
      <WorkerToolbar v-model:filters="filters" v-model:search="q" @search="handleSearch" :loading="loading" />
      <WorkerDataTable v-if="workers" :workers="workers" class="rounded-lg border shadow-sm">
      </WorkerDataTable>
    </div>
  </div>
</template>

<style scoped></style>
