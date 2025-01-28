<script setup lang="ts">
import { Input } from "@/components/ui/input";
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <form class="flex w-[clamp(10rem,50vw,20rem)] items-center gap-2">
      <Input placeholder="Search plan..." class="h-9" />
    </form>
    <div class="mr-auto flex flex-wrap gap-2">
      <slot name="prepend"> </slot>
    </div>

    <div class="flex items-center gap-2">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<style scoped></style>
