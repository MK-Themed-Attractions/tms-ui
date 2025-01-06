<script setup lang="ts">
import { navItemData } from ".";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-vue-next";
import SideNavigation from "./components/SideNavigation.vue";
import SearchForm from "./components/SearchForm.vue";
import UserMenu from "./components/UserMenu.vue";
import MobileNavigation from "./components/MobileNavigation.vue";
</script>

<template>
  <div
    class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  >
    <SideNavigation :items="navItemData" />
    <div class="flex flex-col">
      <header
        class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6"
      >
        <MobileNavigation>
          <Button variant="outline" size="icon" class="shrink-0 md:hidden">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </MobileNavigation>

        <div class="w-full flex-1">
          <SearchForm />
        </div>
        <UserMenu />
      </header>

      <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <Suspense timeout="0">
              <!-- main content -->
              <component :is="Component"></component>

              <!-- loading state -->
              <template #fallback> Loading... </template>
            </Suspense>
          </template>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
