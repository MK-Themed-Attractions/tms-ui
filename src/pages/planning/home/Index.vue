<script setup lang="ts">
import { FilterApp } from "@/components/app/filter";
import PlanToolbar from "./components/PlanToolbar.vue";
import { planDataColumns } from "./components/data";
import { ref } from "vue";
import { Plus } from "lucide-vue-next";
import { usePlanStore } from "@/stores/planStore";
import PlanDataTable from "./components/PlanDataTable.vue";
import { Button } from "@/components/ui/button";
import { storeToRefs } from "pinia";
import { PaginationApp, type PaginationQuery } from "@/components/app/pagination";
import type { PlanQueryParams } from "@/types/planning";
import { useRoute } from "vue-router";
import { Input } from "@/components/ui/input";

const planStore = usePlanStore();
const route = useRoute()
const { filter, getPlans, plans, handleGetPlansWithPagination, hasNextPage, hasPrevPage } = usePlan();
const search = ref<string>()

function usePlan() {
  const filter = ref([]);

  const { plans, hasNextPage, hasPrevPage } = storeToRefs(planStore);

  async function getPlans(params?: Partial<PlanQueryParams>) {
    const res = await planStore.getPlans({
      page: route.query.page ? +route.query.page : undefined,
      per_page: route.query['per-page'] ? route.query['per-page'].toString() : undefined,
      q: search.value,
      ...params
    });
  }

  async function handleGetPlansWithPagination(params: Partial<PaginationQuery>) {
    await getPlans({ page: params.page ? +params.page : undefined, per_page: params.perPage })
  }

  return {
    filter,
    getPlans,
    handleGetPlansWithPagination,
    plans,
    hasNextPage,
    hasPrevPage
  };
}

/* INIT */
await getPlans();
</script>

<template>
  <div class="container space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Planning</h1>
      <p class="text-muted-foreground">
        Create production plan, cancel or override specific tasks.
      </p>
    </div>

    <div>
      <PlanToolbar>
        <template #prepend>
          <Input placeholder="Search plan..." class="h-9 w-[clamp(10rem,50vw,20rem)]" v-model="search"
            @keydown.enter="getPlans()" />
        </template>
        <template #append>
          <Button as-child>
            <RouterLink :to="{ name: 'planningCreate' }">
              <Plus /> Create Plan
            </RouterLink>
          </Button>
        </template>
      </PlanToolbar>
    </div>
    <div class="rounded-md border shadow-sm">
      <PlanDataTable v-if="plans" :plans="plans" :columns="planDataColumns">
        <template #footer>
          <PaginationApp @change:query="handleGetPlansWithPagination" :disable-next="!hasNextPage"
            :disalble-prev="!hasPrevPage" />
        </template>
      </PlanDataTable>
    </div>
  </div>
</template>

<style scoped></style>
