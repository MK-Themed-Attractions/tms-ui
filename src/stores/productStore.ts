import { useAxios } from "@/composables/useAxios";
import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from "./authStore";
import { ref } from "vue";

import { type SimplePaginateAPIResource } from "@/types/pagination";
import type { Product, ProductQueryParameter } from "@/types/products";
import { useStorage } from "@vueuse/core";

export const useProductStore = defineStore("products", () => {
  const baseUrl = import.meta.env.VITE_PRODUCT_URL;
  const authStore = useAuthStore();
  const products = ref<Product[] | null>(null);
  const bearerToken = useStorage(
    import.meta.env.VITE_PRODUCT_BEARER_TOKEN_KEY,
    "",
  );

  /**
   * accumulated products is used to append products on each API request
   * use for infinite scrolling feature b
   */
  const accumulatedProducts = ref<Product[]>([]);

  const { errors, loading, get, setHeader } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  async function getProducts(params?: ProductQueryParameter) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<SimplePaginateAPIResource<Product>>("/api/products", {
      params,
    });
    accumulatedProducts.value = accumulatedProducts.value.concat(
      res?.data ?? [],
    );
    products.value = res?.data ?? null;

    return res?.data;
  }

  return {
    getProducts,
    errors,
    loading,
    products,
    accumulatedProducts,
  };
});
