<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useIntersectionObserver } from "@vueuse/core";
import { useRouterQuery } from "@/composables/useRouterQuery";
import { onBeforeRouteUpdate } from "vue-router";

import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/stores/productStore";
import { LoaderCircle, Search } from "lucide-vue-next";
import ProductCard from "./components/ProductCard.vue";

const { fetchProducts, products } = useProduct();
const intersectionEl = ref<HTMLDivElement | null>(null);
const [page, setPage] = useRouterQuery("page");

await fetchProducts();

function useProduct() {
  const productStore = useProductStore();
  const { accumulatedProducts: products } = storeToRefs(productStore);

  async function fetchProducts() {
    await productStore.getProducts({
      page: parseInt(page.value?.toString() ?? "1"),
    });
  }
  return {
    fetchProducts,
    products,
  };
}

/* use for infinite scrolling */
useIntersectionObserver(
  intersectionEl,
  ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
      /* since query are string, convertion to int is required to increase its value by 1, */
      const nextPage = parseInt(page.value?.toString() ?? "1") + 1;

      /* convert it again to string since query parameters are string */
      setPage(nextPage.toString());
    }
  },
);

/* fetch the products everytime the query parameter changes */
onBeforeRouteUpdate(async (to, from) => {
  /* making sure to only fetch from this(products) page */
  if (from.name === to.name) {
    await fetchProducts();
  }
});

/**
 * when component is about to unmount
 * reset the accumulated products
 */
onBeforeUnmount(() => {
  products.value = [];
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Products</h1>
      <p class="text-muted-foreground">
        List of all available products of MK themed attractions
      </p>
    </div>

    <form class="flex items-center gap-2">
      <Input
        id="email"
        type="search"
        placeholder="Search products..."
        class="max-w-[20rem]"
      />
      <ButtonApp :prepend-icon="Search" variant="secondary" type="submit"
        >Search</ButtonApp
      >
    </form>

    <div>
      <ul class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        <li v-for="product in products">
          <ProductCard :product="product"></ProductCard>
        </li>

        <!-- INFINITE SCROLLING  -->
        <div
          class="col-span-full grid h-[10rem] place-content-center"
          ref="intersectionEl"
        >
          <LoaderCircle class="animate-spin" />
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
