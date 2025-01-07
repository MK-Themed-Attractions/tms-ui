import { useAxios } from "@/composables/useAxios";
import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from "./authStore";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";

import type { BearerTokenPayload, BearerTokenResponse } from "@/types/auth";
import type { SimplePaginate } from "@/types/pagination";
import type { Product, ProductQueryParameter } from "@/types/products";

export const useProductStore = defineStore("products", () => {
  const authStore = useAuthStore();
  const { accessToken, user } = storeToRefs(authStore);

  const bearerToken = useStorage("bearer-token", "");
  const products = ref<Product[] | null>(null);

  /**
   * accumulated products is used to append products on each API request
   * use for infinite scrolling feature b
   */
  const accumulatedProducts = ref<Product[]>([]);

  const { errors, loading, get, post } = useAxios({
    baseURL: "http://tms-products.local",
  });

  async function checkTokenValidity() {
    const res = await post<BearerTokenPayload, BearerTokenResponse>(
      "/api/auth/bearer-token",
      {
        access_token: accessToken?.value?.token || "",
        user_id: user.value.id,
      },
    );

    if (!errors.value) bearerToken.value = res?.bearer_token;
  }

  async function getProducts(params?: ProductQueryParameter) {
    if (!bearerToken.value) {
      await checkTokenValidity();
    }

    const res = await get<{ products: SimplePaginate<Product> }>(
      "/api/products",
      {
        params,
        headers: {
          "Bearer-Token": bearerToken.value,
        },
      },
    );
    accumulatedProducts.value = accumulatedProducts.value.concat(
      res?.products.data ?? [],
    );
    products.value = res?.products.data ?? null;

    return res?.products;
  }

  return {
    getProducts,
    errors,
    loading,
    checkTokenValidity,
    products,
    accumulatedProducts,
  };
});
