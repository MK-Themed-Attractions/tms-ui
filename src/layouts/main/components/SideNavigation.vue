<script setup lang="ts">
import { Bell, Package2 } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import NavItem, { type NavItemProps } from "./NavItem.vue";

export type NavItem = NavItemProps & { name: string };

const props = defineProps<{
  items: NavItem[];
}>();
</script>

<template>
  <div class="hidden border-r bg-muted/40 md:block">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-2 text-xs font-semibold"
        >
          <Package2 class="h-6 w-6" />
          <span class="">Task Management System</span>
        </RouterLink>

        <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
          <Bell class="h-4 w-4" />
          <span class="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
          <NavItem
            v-for="item in items"
            :key="item.to.name"
            :to="item.to"
            :icon="item.icon"
            >{{ item.name }}</NavItem
          >
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
