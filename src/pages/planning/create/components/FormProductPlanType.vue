<script setup lang="ts">
import { Menu, Settings } from "lucide-vue-next";

const isPrototype = defineModel({ default: false });
</script>
<template>
  <ul class="space-y-1 rounded-md border p-4 text-sm">
    <li
      class="flex cursor-pointer gap-4 rounded-md p-2 hover:bg-muted"
      :class="{ 'bg-muted': !isPrototype }"
      role="button"
      @click="isPrototype = false"
    >
      <Menu />
      <div>
        <p class="font-medium">Regular</p>
        <span class="text-muted-foreground"
          >This plan will consider employee efficiency points.</span
        >
      </div>
    </li>
    <li
      class="flex cursor-pointer gap-4 rounded-md p-2 hover:bg-muted"
      :class="{ 'bg-muted': isPrototype }"
      role="button"
      @click="isPrototype = true"
    >
      <Settings />
      <div>
        <p class="font-medium">Prototype</p>
        <span class="text-muted-foreground"
          >This plan will not include any report nor consider efficiency
          points.</span
        >
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
