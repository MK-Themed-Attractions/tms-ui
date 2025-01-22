<script setup lang="ts">
import type { ProductRouting } from "@/types/products";

const props = defineProps<{
  routing: ProductRouting;
}>();
</script>
<template>
  <div class="ml-2 space-y-1 text-sm">
    <p>
      <span class="font-bold">{{ routing.manpower }}</span> manpower required
    </p>
    <p>
      <span class="font-bold">{{ routing.runtime }}</span> minute(s) total
      runtime
    </p>
  </div>
</template>

<style scoped></style>
