<script setup lang="ts">
import {
  computed,
  inject,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  ref,
} from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { mainScrollerKey } from "@/lib/injectionKeys";
import { useRouteQuery } from "@vueuse/router";
import type { Product, ProductQueryParameter } from "@/types/products";

import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/stores/productStore";
import { LoaderCircle, Search } from "lucide-vue-next";
import ProductCard from "./components/ProductCard.vue";

const { fetchProducts, accumulatedProducts, handleSearch, hasResult } =
  useProduct();
const intersectionEl = ref<HTMLDivElement | null>(null);
const page = ref(1);
const q = useRouteQuery<string | undefined>("q");

await fetchProducts();

function useProduct() {
  const productStore = useProductStore();
  const products = ref<Product[]>();

  /**
   * accumulated products is used to append products on each API request
   * use for infinite scrolling feature
   */
  const accumulatedProducts = ref<Product[]>([]);

  const hasResult = computed(() => products.value?.length);

  async function fetchProducts(params?: Partial<ProductQueryParameter>) {
    products.value = await productStore.getProducts({
      page: page.value,
      includes: "images",
      q: q.value,
      ...params,
    });

    accumulatedProducts.value = accumulatedProducts.value?.concat(
      products.value ?? [],
    );
  }

  async function handleSearch() {
    /* reset accumulated products since searching always produced specific products */
    accumulatedProducts.value = [];
    /* reset page to 1 since search results always starts at page 1 */
    page.value = 1;

    /* when search query is empty, fetch products without search query */
    await fetchProducts();
  }

  return {
    fetchProducts,
    accumulatedProducts,
    handleSearch,
    hasResult,
  };
}

/* use for infinite scrolling */
useIntersectionObserver(
  intersectionEl,
  async ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
      /* when user scroll to the bottom of the page,
      fetch the next page */
      page.value++;
      await fetchProducts();
    }
  },
);

/**
 * when component is about to unmount
 * reset the accumulated products
 * to prevent accumulated products from stacking up when user happen to
 * navigate to other page and comes back to this component
 */
onBeforeUnmount(() => {
  accumulatedProducts.value = [];
});

/* use for preserving the scroll of the main layout */
const scroller = inject(mainScrollerKey);
const { getScrollY, scrollMainTo } = scroller
  ? scroller()
  : { getScrollY: null, scrollMainTo: null };

const preserveScroll = ref(0);

/**
 * onDeactivated and onActivated can be used to
 * store and apply the scroll position of the main layout
 * NOTE: only available if the component is wrapped in KeepAlive component
 */

onDeactivated(() => {
  if (getScrollY) preserveScroll.value = getScrollY();
});

onActivated(() => {
  if (scrollMainTo) scrollMainTo(preserveScroll.value);
});
</script>

<template>
  <!-- Product Index -->
  <div class="space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Products</h1>
      <p class="text-muted-foreground text-sm">
        List of all available products of MK themed attractions
      </p>
    </div>

    <form class="flex items-center gap-2" @submit.prevent="handleSearch">
      <Input
        id="email"
        type="search"
        placeholder="Search products..."
        class="max-w-[20rem]"
        v-model="q"
      />
      <ButtonApp :prepend-icon="Search" variant="secondary" type="submit"
        >Search</ButtonApp
      >
    </form>

    <div>
      <ul class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        <li v-for="product in accumulatedProducts">
          <RouterLink
            :to="{ name: 'productShow', params: { productId: product.sku } }"
          >
            <ProductCard :product="product"></ProductCard>
          </RouterLink>
        </li>

        <!-- INFINITE SCROLLING  -->
        <div
          class="col-span-full grid h-[10rem] place-content-center"
          ref="intersectionEl"
          v-if="hasResult"
        >
          <LoaderCircle class="animate-spin" />
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
