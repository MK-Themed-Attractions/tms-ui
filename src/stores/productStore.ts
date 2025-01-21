import { useAxios } from "@/composables/useAxios";
import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from "./authStore";
import { ref } from "vue";

import { type SimplePaginateAPIResource } from "@/types/pagination";
import type {
  Product,
  ProductQueryParameter,
  ProductRoutingBOM,
  ProductRoutingQueryParams,
  ProductShowQueryParams,
} from "@/types/products";
import { useStorage } from "@vueuse/core";

export const useProductStore = defineStore("products", () => {
  const baseUrl = import.meta.env.VITE_PRODUCT_URL;
  const authStore = useAuthStore();
  const products = ref<Product[] | null>(null);
  const product = ref<Product>();
  const bearerToken = useStorage(
    import.meta.env.VITE_PRODUCT_BEARER_TOKEN_KEY,
    "",
  );

  /**
   * accumulated products is used to append products on each API request
   * use for infinite scrolling feature 
   */
  const accumulatedProducts = ref<Product[]>([]);

  const { errors, loading, get, setHeader } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  function invalidate() {
    bearerToken.value = null;
    products.value = null;
  }

  async function getProducts(params?: Partial<ProductQueryParameter>) {
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

  async function getProduct(
    productId: string,
    params?: Partial<ProductShowQueryParams>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: Product }>(`/api/products/${productId}`, {
      params,
    });

    product.value = res?.data;
    return res?.data;
  }

  async function getProductRoutingBom(
    productSku: string,
    params?: Partial<ProductRoutingQueryParams>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: ProductRoutingBOM[] }>(
      `/api/products/get-bom-line/${productSku}`,
      {
        params,
      },
    );

    return res?.data;
  }

  return {
    errors,
    loading,
    products,
    product,
    accumulatedProducts,
    invalidate,
    getProducts,
    getProduct,
    getProductRoutingBom,
  };
});
