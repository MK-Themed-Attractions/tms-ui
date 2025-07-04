<script setup lang="ts">
import { FilterApp } from "@/components/app/filter";
import PlanToolbar from "./components/PlanToolbar.vue";
import { planDataColumns, type StatusFilter } from "./components/data";
import { ref, watch, watchEffect } from "vue";
import { Plus } from "lucide-vue-next";
import { usePlanStore } from "@/stores/planStore";
import PlanDataTable from "./components/PlanDataTable.vue";
import { Button } from "@/components/ui/button";
import { storeToRefs } from "pinia";
import { PaginationApp, type PaginationQuery } from "@/components/app/pagination";
import type { Plan, PlanQueryParams } from "@/types/planning";
import { useRoute } from "vue-router";
import { Input } from "@/components/ui/input";
import { toast } from "vue-sonner";
import { useToastUIStore } from "@/stores/ui/toastUIStore";
import { useAuthStore } from "@/stores/authStore";
import { SectionHeader } from "@/components/app/section-header";
import PlanStatusFilter from "./components/PlanStatusFilter.vue";
import { ButtonApp } from "@/components/app/button";

const search = ref<string>()
const planStore = usePlanStore();
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const route = useRoute()
const { filter, getPlans, plans, handleGetPlansWithPagination, hasNextPage, hasPrevPage, handleDeletePlan } = usePlan();

function usePlan() {
  const filter = ref<StatusFilter[]>([]);
  watch(filter, async () => {
    await getPlans({ page: 1 })
  },)

  const toastUIStore = useToastUIStore()

  const { plans, hasNextPage, hasPrevPage, errors: planErrors } = storeToRefs(planStore);

  async function getPlans(params?: Partial<PlanQueryParams>) {
    const res = await planStore.getPlans({
      filters: [{
        column: 'status_code',
        values: filter.value.map(f => f.name)
      }],
      page: route.query.page ? +route.query.page : undefined,
      per_page: route.query['per-page'] ? route.query['per-page'].toString() : undefined,
      q: search.value,
      ...params
    });
  }

  async function handleGetPlansWithPagination(params: Partial<PaginationQuery>) {
    await getPlans({ page: params.page ? +params.page : undefined, per_page: params.perPage })
  }

  async function handleDeletePlan(plan: Plan) {
    await planStore.deletePlan(plan.id, { user_id: user.value.id })

    if (!planErrors.value) {
      const toastId = toast.loading(`Plan ${plan.plan_data.code} Notice`, {
        description: 'Plan deletion in progress. We will notify you once it is deleted'
      })

      /* save the toast, this will be used 
      to delete the toast when push notif from backend 
      has been received. */
      toastUIStore.setToast(toastId);

    } else {
      toast.error('Plan Error notice', {
        description: "Something went wrong while deleting the plan."
      })
    }
  }

  return {
    filter,
    getPlans,
    handleGetPlansWithPagination,
    plans,
    hasNextPage,
    hasPrevPage,
    handleDeletePlan
  };
}

/* INIT */
await getPlans();
</script>

<template>
  <div class="container space-y-6">

    <SectionHeader title="Planning" description="Create production plan, cancel or override specific tasks." />


    <div>
      <PlanToolbar>
        <template #prepend>
          <Input placeholder="Search plan..." class="h-9 w-[clamp(10rem,50vw,20rem)]" v-model="search"
            @keydown.enter="getPlans()" />
          <PlanStatusFilter v-model="filter" />
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
      <PlanDataTable v-if="plans" :plans="plans" :columns="planDataColumns" @delete="handleDeletePlan">
        <template #footer>
          <PaginationApp @change:query="handleGetPlansWithPagination" :disable-next="!hasNextPage"
            :disalble-prev="!hasPrevPage" />
        </template>
      </PlanDataTable>
    </div>
  </div>
</template>

<style scoped></style>
