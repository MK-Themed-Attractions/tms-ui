import { useAxios } from "@/composables/useAxios";
import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from "./authStore";
import { ref } from "vue";

import { type SimplePaginateAPIResource } from "@/types/pagination";
import type { Product, ProductQueryParameter } from "@/types/products";
import { useStorage } from "@vueuse/core";

export const useProductStore = defineStore("products", () => {
  const baseUrl = "http://tms-products.local";
  const authStore = useAuthStore();
  const products = ref<Product[] | null>(null);
  const bearerToken = useStorage("tms-products-bearer-token", "");

  /**
   * accumulated products is used to append products on each API request
   * use for infinite scrolling feature b
   */
  const accumulatedProducts = ref<Product[]>([]);

  const { errors, loading, get, post } = useAxios({
    baseURL: baseUrl,
  });

  async function getProducts(params?: ProductQueryParameter) {
    if (!bearerToken.value)
      bearerToken.value = await authStore.checkTokenValidity(
        `${baseUrl}/api/auth/bearer-token`,
      );

    const res = await get<SimplePaginateAPIResource<Product>>("/api/products", {
      params,
      headers: {
        "Bearer-Token": bearerToken.value,
      },
    });
    console.log(res);
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
