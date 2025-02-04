<script setup lang="ts">
import { usePlanStore } from "@/stores/planStore";
import ProductImage from "./components/ProductImage.vue";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import PlanInfo from "./components/PlanInfo.vue";

const planStore = usePlanStore();
const { plan } = storeToRefs(planStore);

const productData = computed(() => plan.value?.product_data);
</script>

<template>
  <div class="container">
    <div class="grid gap-4 lg:grid-cols-2">
      <ProductImage v-if="productData" :product="productData" class="mx-auto" />
      <PlanInfo v-if="plan" :plan="plan" />

      <div class="col-span-full text-sm">
        <h3 class="border-b pb-2 font-medium">Batches:</h3>

        <div v-if="plan?.batches?.length">
          {{ plan?.batches }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
