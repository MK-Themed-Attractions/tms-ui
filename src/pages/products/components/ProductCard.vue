<script setup lang="ts">
import { ImageApp } from "@/components/app/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/products";
import { computed } from "vue";

const props = defineProps<{
  product: Product;
}>();

const imageThumbnail = computed(() => {
  if (props.product.images?.length) return props.product.images[0].tiny_image;
  else return "";
});

const title = computed(() => {
  return props.product.title.toLowerCase();
});
</script>
<template>
  <Card class="flex min-h-[6rem] items-center gap-2 p-2 text-sm">
    <div class="min-w-[5rem] max-w-[5rem]">
      <ImageApp
        :image="imageThumbnail"
        class="mx-auto aspect-square max-w-full object-cover"
        :class="{ 'max-w-10': !imageThumbnail }"
      />
    </div>
    <div>
      <h3 class="line-clamp-2 font-medium capitalize">{{ title }}</h3>
      <span class="text-muted-foreground font-medium">{{ product.sku }}</span>
    </div>
  </Card>
</template>

<style scoped></style>
