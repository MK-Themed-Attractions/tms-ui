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
import { useRouteQuery } from "@vueuse/router";
import type { Product, ProductQueryParameter } from "@/types/products";

import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/stores/productStore";
import { useLabelPrintingStore } from "@/stores/labelPrintingStore";
import {
  LoaderCircle,
  PrinterIcon,
  Search,
  XCircleIcon,
} from "lucide-vue-next";
import ProductCard from "../components/ProductCard.vue";
import { mainScrollerKey } from "@/lib/injectionKeys";

// State
const page = ref(1);
const q = useRouteQuery<string | undefined>("q");
const intersectionEl = ref(null);

// Stores
const productStore = useProductStore();
const labelPrintingStore = useLabelPrintingStore();

// Loading + Pagination Flags
const isLoading = ref(false);
const hasMore = ref(true);

// Data
const products = ref<Product[]>([]);
const accumulatedProducts = ref<Product[]>([]);
const hasResult = computed(() => accumulatedProducts.value.length > 0);

// Methods
async function fetchProducts(params?: Partial<ProductQueryParameter>) {
  isLoading.value = true;

  const result = await productStore.getProducts({
    page: page.value,
    includes: "images,product_parts",
    q: q.value,
    ...params,
  });

  products.value = result ?? [];

  if (products.value.length === 0 && page.value > 1) {
    hasMore.value = false;
  }

  if (page.value > 1) {
    accumulatedProducts.value = accumulatedProducts.value.concat(
      products.value,
    );
  } else {
    accumulatedProducts.value = [...products.value];
  }

  isLoading.value = false;
}

async function handleSearch() {
  page.value = 1;
  hasMore.value = true;
  accumulatedProducts.value = [];
  await fetchProducts();
}

// Initial Fetch
await fetchProducts();

// Infinite Scroll Observer
useIntersectionObserver(intersectionEl, async ([{ isIntersecting }]) => {
  if (isIntersecting && hasResult.value && hasMore.value && !isLoading.value) {
    page.value++;
    await fetchProducts();
  }
});

// Scroll Restore Logic
const scroller = inject(mainScrollerKey);
const { getScrollY, scrollMainTo } = scroller
  ? scroller()
  : { getScrollY: null, scrollMainTo: null };

const preserveScroll = ref(0);
onDeactivated(() => {
  if (getScrollY) preserveScroll.value = getScrollY();
});
onActivated(() => {
  if (scrollMainTo) scrollMainTo(preserveScroll.value);
});
onBeforeUnmount(() => {
  accumulatedProducts.value = [];
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Label Printer Products</h1>
      <p class="text-sm text-muted-foreground">Select Product to Print</p>
    </div>

    <!-- Search + Actions -->
    <div class="flex justify-between">
      <form class="flex items-center gap-2" @submit.prevent="handleSearch">
        <Input
          type="search"
          placeholder="Search products..."
          class="max-w-[20rem]"
          v-model="q"
        />

        <ButtonApp :prepend-icon="Search" variant="secondary" type="submit">
          Search
        </ButtonApp>
      </form>
      <div class="flex gap-2">
        <ButtonApp
          @click="labelPrintingStore.clearSelection()"
          :prepend-icon="XCircleIcon"
          variant="primary"
          class="border"
          type="button"
          v-if="labelPrintingStore.selectedProducts.size != 0"
        >
          Clear
        </ButtonApp>
        <RouterLink :to="{ name: 'labelPrinterConfiguration' }">
          <ButtonApp
            :prepend-icon="PrinterIcon"
            variant="primary"
            class="border"
            type="button"
            :disabled="labelPrintingStore.selectedProducts.size === 0"
          >
            Print ({{ labelPrintingStore.selectedProducts.size }})
          </ButtonApp>
        </RouterLink>
      </div>
    </div>
    <!-- Product Grid -->
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      <label
        v-for="product in accumulatedProducts"
        :key="product.id"
        class="relative inline-flex w-full cursor-pointer"
      >
        <input
          type="checkbox"
          class="form-checkbox peer absolute left-2 top-2 z-10"
          :checked="labelPrintingStore.isSelected(product.sku)"
          @change="labelPrintingStore.toggleSelection(product)"
        />
        <ProductCard
          :product="product"
          class="w-full peer-checked:ring-2 peer-checked:ring-primary peer-checked:ring-offset-2"
        />
      </label>

      <!-- Loading Spinner -->
      <div
        v-if="hasResult && hasMore"
        class="col-span-full grid h-[10rem] place-content-center"
        ref="intersectionEl"
      >
        <LoaderCircle class="animate-spin" />
      </div>

      <!-- No Results -->
      <div
        v-if="!hasResult && !isLoading"
        class="py-10 text-center text-muted-foreground"
      >
        No products found.
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-checkbox {
  width: 1rem;
  height: 1rem;
}
</style>
