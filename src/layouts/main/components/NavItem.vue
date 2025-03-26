<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, type Component } from "vue";
import { RouterLink, type RouteLocationAsRelativeGeneric } from "vue-router";
import type { NavItem } from "./SideNavigation.vue";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePermission } from "../usePermission";

export type NavItemProps = {
  icon?: Component;
  to?: RouteLocationAsRelativeGeneric;
  children?: NavItem[];
};
const props = defineProps<NavItemProps>();

const route = useRoute();
const { hasPermission } = usePermission()

/**
 * for giving the parent a style
 * depending on whether one of its child route is currenly an active route
 */
const isChildRouteSelected = computed(() => {
  return props.children?.some((child) => {
    return child.to?.name === route.name;
  });
});
</script>

<template>
  <!-- For navigation without children -->
  <RouterLink v-if="!children?.length && to"
    class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
    exact-active-class="bg-muted text-primary" :to="to">
    <slot name="icon">
      <component v-if="icon" :is="icon" class="h-6 w-6 lg:h-4 lg:w-4" />
    </slot>

    <slot />
  </RouterLink>

  <!-- For group navigation (with children) -->
  <Accordion v-else type="single" collapsible>
    <AccordionItem value="1" class="border-none">
      <AccordionTrigger
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:no-underline">
        <div class="flex items-center gap-3" :class="{ 'text-primary': isChildRouteSelected }">
          <component v-if="icon" :is="icon" class="h-6 w-6 lg:h-4 lg:w-4" />
          <slot />
        </div>
      </AccordionTrigger>
      <AccordionContent class="ml-2 grid gap-1 rounded-md">
        <template v-for="child in children" :key="child.name">
          <RouterLink v-if="child.to" :to="child.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            exact-active-class="bg-muted text-primary"
            v-show="!child.permissionKey ? true : hasPermission(child.permissionKey)">
            <slot name="icon">
              <component v-if="child.icon" :is="child.icon" class="h-6 w-6 lg:h-4 lg:w-4" />
            </slot>

            <span>{{ child.name }}</span>
          </RouterLink>
        </template>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>

<style scoped></style>
