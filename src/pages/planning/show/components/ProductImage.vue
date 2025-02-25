<script setup lang="ts">
import { ImageApp } from "@/components/app/image";
import { getS3Link } from "@/lib/utils";
import type { PlanProductData } from "@/types/planning";
import { AlertCircle } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  product: PlanProductData;
}>();

const productImage = computed(() => {
  if (props.product.image) return props.product.image.filename;
});
</script>
<template>
  <div class="rounded-md border p-4 shadow">
    <ImageApp v-if="productImage" :image="getS3Link(productImage, 'medium')" class="max-h-full max-w-full" />

    <div v-else class="flex w-full aspect-square items-center justify-center gap-2">
      <AlertCircle /> <span>No image available!</span>
    </div>

    <div class="place-self-center text-center">
      <p class="font-medium">{{ product.title }}</p>
      <span class="text-muted-foreground">{{ product.sku }}</span>
    </div>
  </div>
</template>

<style scoped></style>
