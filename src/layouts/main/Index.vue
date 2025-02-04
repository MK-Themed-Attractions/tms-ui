<script setup lang="ts">
import { navItemData } from "./data";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-vue-next";
import SideNavigation from "./components/SideNavigation.vue";
import SearchForm from "./components/SearchForm.vue";
import UserMenu from "./components/UserMenu.vue";
import MobileNavigation from "./components/MobileNavigation.vue";
import { templateRef, useScroll } from "@vueuse/core";
import { provide, ref } from "vue";
import { mainScrollerKey } from "@/lib/injectionKeys";
import { useProductStore } from "@/stores/productStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { storeToRefs } from "pinia";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Product } from "@/types/products";
import { ImageApp } from "@/components/app/image";
import { PopoverAnchor } from "radix-vue";
import { useAuthStore } from "@/stores/authStore";

const main = templateRef("main");
const { y } = useScroll(main);
const productStore = useProductStore();
const { handleSearch, loading, products, productPopover } = useSearch();

function useMainScroller() {
  function scrollMainTo(yScroll: number) {
    main.value.scrollTo({
      top: yScroll,
    });
  }

  function getScrollY() {
    return y.value;
  }

  return {
    getScrollY,
    scrollMainTo,
  };
}

function useSearch() {
  const { loading } = storeToRefs(productStore);
  const products = ref<Product[]>();
  const productPopover = ref(false);

  async function handleSearch(search: string) {
    /* do not fetch when search is empty or is currently loading to prevent 
    unnecessary fetch */
    if (!search || loading.value) return;

    products.value = await productStore.getProducts({
      q: search,
      includes: "images",
    });
    productPopover.value = true;
  }

  return {
    loading,
    handleSearch,
    products,
    productPopover,
  };
}

/* INIT */

provide(mainScrollerKey, useMainScroller);
</script>

<template>
  <div class="fixed grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
    <SideNavigation
      class="hidden border-r bg-muted/40 lg:block"
      :items="navItemData"
    />
    <div class="flex flex-col">
      <header
        class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6"
      >
        <MobileNavigation>
          <Button variant="outline" size="icon" class="shrink-0 lg:hidden">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </MobileNavigation>

        <div class="w-full flex-1">
          <Popover v-model:open="productPopover">
            <PopoverAnchor as-child>
              <SearchForm
                class="w-[clamp(10rem,50vw,23rem)]"
                @submit="handleSearch"
                :loading="loading"
              />
            </PopoverAnchor>

            <PopoverContent
              align="start"
              class="mt-1 w-[clamp(10rem,50vw,23rem)]"
            >
              <ScrollArea class="max-h-[80vh] overflow-auto">
                <ul class="space-y-2">
                  <li
                    v-for="product in products"
                    :key="product.id"
                    class="rounded-md p-1 duration-300 focus-within:bg-secondary hover:bg-secondary"
                  >
                    <RouterLink
                      :to="{
                        name: 'productShow',
                        params: { productId: product.sku },
                      }"
                      class="flex items-center gap-2"
                    >
                      <div>
                        <ImageApp
                          :image="
                            product.images ? product.images[0]?.thumbnail : ''
                          "
                          class="max-w-[3rem]"
                        />
                      </div>
                      <div class="text-sm">
                        <p class="font-medium">{{ product.title }}</p>
                        <span class="text-muted-foreground">{{
                          product.sku
                        }}</span>
                      </div>
                    </RouterLink>
                  </li>
                </ul>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        <UserMenu />
      </header>

      <main
        class="flex max-h-[91vh] flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6"
        ref="main"
      >
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
