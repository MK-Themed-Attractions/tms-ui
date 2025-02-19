<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { ImageApp } from "@/components/app/image";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/stores/productStore";
import type { Product, ProductQueryParameter } from "@/types/products";
import { AlertCircle, LoaderCircle, RefreshCcw, Search } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";

defineOptions({
  inheritAttrs: false,
});
const selectedProductId = defineModel({ default: "" });

const { products, fetchProducts, loading, fetchProduct } = useProduct();
const { search, searchProduct } = useSearchProduct();
const { handleClearSelection, handleSelectProduct, selectedProduct } =
  useSelect();

function useProduct() {
  const productStore = useProductStore();
  const { loading } = storeToRefs(productStore);
  const products = ref<Product[]>();

  async function fetchProducts(params?: Partial<ProductQueryParameter>) {
    products.value = await productStore.getProducts({
      includes: "images",
      ...params,
    });
  }

  async function fetchProduct(
    productId: string,
    params?: Partial<ProductQueryParameter>,
  ) {
    await productStore.getProduct(productId, {
      includes: "images,routings",
      ...params,
    });
  }

  return {
    products,
    fetchProducts,
    fetchProduct,
    loading,
  };
}

function useSearchProduct() {
  const search = ref("");

  async function searchProduct() {
    await fetchProducts({ q: search.value });
  }

  return {
    search,
    searchProduct,
  };
}

function useSelect() {
  const selectedProduct = ref<Product>();

  async function handleSelectProduct(product: Product) {
    await fetchProduct(product.sku);

    const rawProduct = JSON.parse(JSON.stringify(product));
    selectedProductId.value = rawProduct.sku;
    selectedProduct.value = rawProduct;
  }

  function handleClearSelection() {
    selectedProduct.value = undefined;
    selectedProductId.value = "";
    search.value = "";
  }

  return {
    handleClearSelection,
    handleSelectProduct,
    selectedProduct,
  };
}
/* INIT */

if (!products.value) await fetchProducts();

/* When form or cleared or the productId is empty, clear the selection */
watchEffect(() => {
  if (!selectedProductId.value) {
    handleClearSelection();
  }
});
</script>

<template>
  <div>
    <div class="rounded-lg border text-sm shadow-md" v-if="!selectedProduct">
      <div class="relative border-b pl-6">
        <input
          class="w-full rounded-tl-md rounded-tr-md p-3 text-sm focus:outline-none"
          placeholder="Search product..."
          v-model="search"
          @keydown.enter.prevent="searchProduct"
        />
        <Search
          class="absolute left-2 top-1/2 -translate-y-1/2 stroke-muted-foreground"
          :size="17"
        />
      </div>

      <div class="grid min-h-[5rem] p-3">
        <ul
          class="max-h-[20rem] overflow-auto"
          v-if="products?.length && !loading"
        >
          <li
            v-for="product in products"
            :key="product.id"
            class="cursor-default rounded p-2 hover:bg-muted"
            @click="handleSelectProduct(product)"
          >
            <span class="font-medium">{{ product.sku }} -</span>
            {{ product.title }}
          </li>
        </ul>

        <div
          class="place-content-center text-center font-medium"
          v-else-if="!loading"
        >
          No search result.
        </div>

        <div class="place-content-center text-center" v-if="loading">
          <LoaderCircle class="mx-auto animate-spin stroke-muted-foreground" />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="relative">
        <Input
          readonly
          disabled
          :model-value="selectedProductId"
          v-bind="$attrs"
        />
        <ButtonApp
          variant="outline"
          size="icon"
          class="absolute right-1 top-1/2 h-8 -translate-y-1/2"
          type="button"
          @click="handleClearSelection"
        >
          <RefreshCcw />
        </ButtonApp>
      </div>

      <div class="mt-2 rounded-md border p-3">
        <ImageApp
          class="mx-auto max-w-[14rem]"
          v-if="selectedProduct.images?.length"
          :image="selectedProduct.images[0].thumbnail"
        />
        <div
          v-else
          class="mb-4 flex min-h-[13rem] items-center justify-center gap-2 rounded-md border border-dashed text-sm"
        >
          <AlertCircle class="text-muted-foreground" :size="17" /> No Image
          Available
        </div>
        <div class="text-center text-sm">
          <h4 class="font-semibold">{{ selectedProduct.title }}</h4>
          <p class="text-muted-foreground">{{ selectedProduct.sku }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
