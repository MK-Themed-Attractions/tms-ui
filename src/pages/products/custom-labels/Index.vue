<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { Router } from "vue-router";

import { storeToRefs } from "pinia";

/* UI Imports */
import { SectionHeader } from "@/components/app/section-header";
import { DataTable } from "@/components/app/data-table";
import {
  PaginationApp,
  type PaginationQuery,
} from "@/components/app/pagination";
import { customLabelColumns } from "./components/data";
import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-vue-next";
const route = useRoute();

import type { CustomLabel, CustomLabelQueryParams } from "@/types/customLabel";
import { useCustomLabelStore } from "@/stores/customLabelStore";
const customLabelStore = useCustomLabelStore();
const {
  fetchCustomLabels,
  handlePagination,
  hasNextPage,
  hasPrevPage,
  customLabels,
  labelLoading,
} = useCustomLabel();
const search = ref<string>();
await fetchCustomLabels();
const page = ref(1);
function gotoShow(customLabel: CustomLabel, router: Router) {
  router.push({
    name: "customLabelShow",
    params: { customLabelID: customLabel.id },
  });
}
function useCustomLabel() {
  const {
    hasNextPage,
    hasPrevPage,
    customLabels,
    errors: planErrors,
    loading: labelLoading,
  } = storeToRefs(customLabelStore);

  async function fetchCustomLabels(params?: Partial<CustomLabelQueryParams>) {
    const res = await customLabelStore.getCustomLabels({
      page: route.query.page ? +route.query.page : undefined,
      per_page: route.query["per-page"]
        ? route.query["per-page"].toString()
        : undefined,
      q: search.value,
      ...params,
    });
  }
  const hasResult = computed(() => customLabels.value?.length);
  async function handlePagination(params: Partial<PaginationQuery>) {
    await fetchCustomLabels({
      page: params.page ? +params.page : undefined,
      per_page: params.perPage,
    });
  }
  return {
    fetchCustomLabels,
    handlePagination,
    hasNextPage,
    hasPrevPage,
    customLabels,
    labelLoading,
  };
}
watch(
  () => route.name,
  (toName, fromName) => {
    if (toName === "customLabelList") {
      fetchCustomLabels();
    }
  },
);
</script>
<template>
  <!-- Product Index -->
  <div class="space-y-6">
    <SectionHeader
      title="Custom Labels"
      description="List of all custom labels in MK Themed Attractions"
    />
    <div class="flex w-full justify-between">
      <Input
        placeholder="Search custom labels..."
        class="h-9 w-[clamp(10rem,50vw,20rem)]"
        v-model="search"
        @keydown.enter="fetchCustomLabels()"
      />

      <RouterLink :to="{ name: 'customLabelCreate' }">
        <ButtonApp :prepend-icon="Plus"> Create </ButtonApp>
      </RouterLink>
    </div>

    <DataTable
      v-if="customLabels"
      :items="customLabels"
      :columns="customLabelColumns"
      :loading="labelLoading"
      @navigate-to="gotoShow"
    >
      <template #footer>
        <PaginationApp
          @change:query="handlePagination"
          :disable-next="!hasNextPage"
          :disalble-prev="!hasPrevPage"
        />
      </template>
    </DataTable>
  </div>
</template>

<style scoped></style>
