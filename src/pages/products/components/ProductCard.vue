<script setup lang="ts">
import { ImageApp } from "@/components/app/image";
import { Card, CardContent } from "@/components/ui/card";
import { getS3Link } from "@/lib/utils";
import type { Product } from "@/types/products";
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
  product: Product;
}>();

const imageThumbnail = computed(() => {
  if (props.product.images?.length) return props.product.images[0].filename;
  else return '';
});

const title = computed(() => {
  return props.product.title.toLowerCase();
});
</script>
<template>
  <Card :is="RouterLink"
    class="flex min-h-[6rem] items-center gap-2 p-2 text-sm duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div class="min-w-[5rem] max-w-[5rem]">
      <ImageApp :image="getS3Link(imageThumbnail, 'small')" class="mx-auto aspect-square max-w-full object-cover"
        :class="{ 'w-5': !imageThumbnail }" />
    </div>
    <div>
      <h3 class="mb-2 line-clamp-2 font-medium capitalize">{{ title }}</h3>
      <span class="font-medium text-muted-foreground">{{ product.sku }}</span>
    </div>
  </Card>
</template>

<style scoped></style>
