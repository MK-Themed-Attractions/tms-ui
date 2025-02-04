<script setup lang="ts">
import type { Plan, PlanStatusCode } from "@/types/planning";

const props = defineProps<{
  plan: Plan;
}>();
</script>

<template>
  <div class="text-sm">
    <h3 class="border-b pb-2 font-medium">Plan details:</h3>

    <div class="mt-2 flex flex-wrap gap-4">
      <div class="flex flex-1 flex-col">
        <span>{{ plan.status_code }}</span>
        <span class="text-muted-foreground">Status</span>
      </div>
      <div class="flex flex-1 flex-col">
        <span>{{ plan.plan_data.code }}</span>
        <span class="text-muted-foreground">Plan code</span>
      </div>
      <div class="flex flex-1 flex-col">
        <span>{{ plan.plan_data.is_prototype ? "Prototype" : "Regular" }}</span>
        <span class="text-muted-foreground">Plan type</span>
      </div>

      <div class="flex w-full grow flex-col">
        <span>{{ plan.plan_data.description || "No description" }}</span>
        <span class="text-muted-foreground">Description</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
