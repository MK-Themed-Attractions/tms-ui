<script setup lang="ts">
import type { Component } from "vue";
import { RouterLink, type RouteLocationAsRelativeGeneric } from "vue-router";

export type NavItemProps = {
  icon?: Component;
  to: RouteLocationAsRelativeGeneric;
};
const props = defineProps<NavItemProps>();
</script>

<template>
  <RouterLink
    class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
    :class="{ 'bg-muted text-primary': $route.name === to.name }"
    :to="to"
  >
    <slot name="icon">
      <component v-if="icon" :is="icon" class="h-4 w-4" />
    </slot>

    <slot />
  </RouterLink>
</template>

<style scoped></style>
