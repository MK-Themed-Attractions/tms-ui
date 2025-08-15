<script setup lang="ts">
import { Bell, Package2 } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import NavItem, { type NavItemProps } from "./NavItem.vue";
import { usePermission } from "../usePermission";

export type NavItem = NavItemProps & { name: string, permissionKey?: string };

const props = defineProps<{
  items: NavItem[];
}>();

const { someChildHasPermission, hasPermission } = usePermission()

function canShowNavItem(item: NavItem) {
  /* display the nav when it has no permission key and has no children (open feature)*/
  if (!item.permissionKey && !item.children) return true;

  /* display when at least 1 child matches one of the user's permission */
  if (item.children)
    return someChildHasPermission(item.children)
  else {
    /* display the nav when permission key matches one of the user's permission */
    return hasPermission(item.permissionKey)
  }

}
</script>

<template>
  <div>
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 text-xs font-semibold">
          <Package2 class="h-6 w-6" />
          <span class="">Task Management System</span>
        </RouterLink>

      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
          <NavItem v-for="item in items" :key="item.to?.name || item.name" :to="item.to" :icon="item.icon"
            v-show="canShowNavItem(item)" :children="item.children">{{
              item.name }}
          </NavItem>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
