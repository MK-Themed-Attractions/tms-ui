<script setup lang="ts">
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import { storeToRefs } from "pinia";
import DepartmentDataTable from "./components/DepartmentDataTable.vue";
import DepartmentToolbar from "./components/DepartmentToolbar.vue";
import { provide, type Ref } from "vue";
import { workerDepartmentOnSuccessKey } from "@/lib/injectionKeys";
import type { WorkerDepartmentQueryParams } from "@/types/workers";
import { useRoute } from "vue-router";
import {
  PaginationApp,
  type PaginationQuery,
} from "@/components/app/pagination";
import { useRouteQuery } from "@vueuse/router";

const route = useRoute();
const {
  fetchDepartments,
  departments,
  handleQueryChange,
  hasNextPage,
  hasPrevPage,
} = useWorkerDepartment();
const { handleSearch, search } = useSearch();

function useWorkerDepartment() {
  const workerDepartmentStore = useWorkerDepartmentStore();
  const { departments, hasNextPage, hasPrevPage } = storeToRefs(
    workerDepartmentStore,
  );

  async function fetchDepartments(
    params?: Partial<WorkerDepartmentQueryParams>,
  ) {
    await workerDepartmentStore.getDepartments({
      q: route.query.q ? route.query.q.toString() : "",
      per_page: route.query["per-page"] ? +route.query["per-page"] : 30,
      page: route.query.page ? +route.query.page : 1,
      ...params,
    });
  }

  async function handleQueryChange(query: Partial<PaginationQuery>) {
    await fetchDepartments({
      page: query.page,
      per_page: query.perPage ? +query.perPage : 30,
    });
  }

  return {
    fetchDepartments,
    departments,
    handleQueryChange,
    hasNextPage,
    hasPrevPage,
  };
}

function useSearch() {
  const search = useRouteQuery("q") as Ref<string>;

  async function handleSearch(searchQuery: string) {
    await fetchDepartments({
      q: search.value?.toString(),
    });
  }

  return {
    search,
    handleSearch,
  };
}
/**
 * use to provide a central fetching function
 * everytime a CRUD happens to any child component
 */
provide(workerDepartmentOnSuccessKey, async () => {
  await fetchDepartments();
});

/* INIT */
if (!departments.value) await fetchDepartments();
</script>

<template>
  <div class="container space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Workers Department</h1>
      <p class="w-[70ch] text-sm text-muted-foreground md:text-base">
        Manage workers' departments, edit their details, update information, or
        delete entries. View a list of all workers in a selected department.
      </p>
    </div>

    <div>
      <DepartmentToolbar class="mb-4" v-model:search="search" @search="handleSearch" />

      <DepartmentDataTable v-if="departments" :departments="departments">
        <template #footer>
          <PaginationApp @change:query="handleQueryChange" :disable-next="!hasNextPage" :disable-prev="!hasPrevPage">
          </PaginationApp>
        </template>
      </DepartmentDataTable>
    </div>
  </div>
</template>

<style scoped></style>
