<script setup lang="ts">
import { navItemData } from "../data";

import { Package2 } from "lucide-vue-next";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import NavItem from "./NavItem.vue";
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <slot />
    </SheetTrigger>
    <SheetContent side="left" class="flex flex-col">
      <nav class="grid gap-2 text-lg font-medium">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-2 text-lg font-semibold"
        >
          <Package2 class="h-6 w-6" />
          <span class="sr-only">Acme Inc</span>
        </RouterLink>
        <NavItem
          v-for="item in navItemData"
          :key="item.to?.name || item.name"
          :to="item.to"
          :icon="item.icon"
          :children="item.children"
          >{{ item.name }}</NavItem
        >

        <!-- <NavItem
          v-for="item in navItemData"
          :key="item.to?.name || item.name"
          :to="item.to"
          :children="item.children"
          class="mx-[-0.65rem]"
        >
          <template #icon v-if="item.icon">
            <component :is="item.icon" class="aspect-square h-5" />
          </template>
          {{ item.name }}
        </NavItem> -->
      </nav>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
