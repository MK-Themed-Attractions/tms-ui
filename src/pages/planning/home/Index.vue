<script setup lang="ts">
import { FilterApp } from "@/components/app/filter";
import PlanToolbar from "./components/PlanToolbar.vue";
import { planStatuses, planDataColumns } from "./components/data";
import { ref } from "vue";
import { ButtonApp } from "@/components/app/button";
import { Plus } from "lucide-vue-next";
import { usePlanStore } from "@/stores/planStore";
import PlanDataTable from "./components/PlanDataTable.vue";
import type { Plan } from "@/types/planning";
import PlanDialog from "./components/PlanDialog.vue";

const authStore = usePlanStore();
const { filter, getPlans, plans } = usePlan();

function usePlan() {
  const filter = ref([]);
  const plans = ref<Plan[]>();

  async function getPlans() {
    const res = await authStore.getPlans();
    plans.value = res?.data;
  }

  return {
    filter,
    getPlans,
    plans,
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
          <FilterApp
            v-model="filter"
            text="Status"
            :items="planStatuses"
          ></FilterApp>
        </template>
        <template #append>
          <PlanDialog
            title="Create new plan"
            description="Fill out the form below, please review the plan before saving."
          >
          </PlanDialog>
        </template>
      </PlanToolbar>
    </div>
    <div class="rounded-md border shadow-sm">
      <PlanDataTable v-if="plans" :plans="plans" :columns="planDataColumns">
      </PlanDataTable>
    </div>
  </div>
</template>

<style scoped></style>
