<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import type { Plan } from "@/types/planning";
import { Pencil } from "lucide-vue-next";

const props = defineProps<{
  plan: Plan;
}>();
const emits = defineEmits<{
  (e: "edit"): void;
}>();
</script>

<template>
  <div class="text-sm">
    <div class="flex items-center justify-between border-b pb-2">
      <h3 class="font-medium">Plan details:</h3>
      <ButtonApp size="icon" variant="ghost" @click="$emit('edit')"
        ><Pencil />
      </ButtonApp>
    </div>

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
