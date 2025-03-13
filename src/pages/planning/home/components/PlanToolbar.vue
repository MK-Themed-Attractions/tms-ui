<script setup lang="ts">
import { Input } from "@/components/ui/input";

const search = defineModel<string>('search')
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <div class="mr-auto flex flex-wrap gap-2">
      <slot name="prepend"> </slot>
    </div>

    <div class="flex items-center gap-2">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<style scoped></style>
