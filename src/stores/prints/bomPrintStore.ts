import type { Product } from "@/types/products";
import type { WipPlan, WipTask } from "@/types/wip";
import { defineStore } from "pinia";
import { computed } from "vue";
import { ref } from "vue";

export const useBomPrintStore = defineStore("bomPrint", () => {
  const product = ref<Product>();
  const task = ref<WipTask>();
  const plan = ref<WipPlan>();

  const routing = computed(() =>
    product.value?.routings?.find(
      (r) => r.operation_code === task.value?.operation_code,
    ),
  );

  return {
    product,
    task,
    plan,
    routing,
  };
});
