<script setup lang="ts">
import { ImageApp } from "@/components/app/image";
import { getS3Link } from "@/lib/utils";
import type { Product } from "@/types/products";
import { AlertCircle } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  product: Product;
}>();

const productImage = computed(() => {
  if (props.product.images) return props.product.images[0]?.thumbnail;
});
</script>
<template>
  <div class="grid aspect-square max-w-[25rem] rounded-md border p-4 shadow">
    <ImageApp
      v-if="productImage"
      :image="getS3Link(productImage)"
      class="mx-auto"
    />

    <div v-else class="flex w-[20rem] items-center justify-center gap-2">
      <AlertCircle /> <span>No image available!</span>
    </div>

    <div class="self-end text-center">
      <p class="font-medium">{{ product.title }}</p>
      <span class="text-muted-foreground">{{ product.sku }}</span>
    </div>
  </div>
</template>

<style scoped></style>
