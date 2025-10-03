import { useAxios } from "@/composables/useAxios";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { computed, ref } from "vue";

import {
  type SimplePaginate,
  type SimplePaginateAPIResource,
} from "@/types/pagination";
import type {
  Product,
  ProductAttachment,
  ProductBomQueryParams,
  ProductQueryParameter,
  ProductResource,
  ProductRoutingBOM,
  ProductRoutingQueryParams,
  ProductRoutingWorkcenter,
  ProductShowQueryParams,
} from "@/types/products";
import { useStorage } from "@vueuse/core";
import type { ProductResourceType } from "@/pages/products/show";

export const useProductStore = defineStore("products", () => {
  const baseUrl = import.meta.env.VITE_PRODUCT;
  const authStore = useAuthStore();
  const products = ref<Product[] | null>(null);
  const product = ref<Product>();
  const workCenters = ref<ProductRoutingWorkcenter[]>();
  const bearerToken = useStorage(
    import.meta.env.VITE_PRODUCT_BEARER_TOKEN_KEY,
    "",
  );

  const { errors, loading, get, setHeader } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  function invalidate() {
    bearerToken.value = null;
    products.value = null;
  }

  /* GETTERS */
  const filteredRoutings = computed(() => {
    return product.value?.routings?.filter((route) => {
      return !route.is_autocomplete;
    });
  });

  /* ACTIONS */
  async function getProducts(params?: Partial<ProductQueryParameter>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<SimplePaginateAPIResource<Product>>("/api/products", {
      params,
    });
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

  /**
   * Gets the product routing BOM
   * @param productSku
   * @param params
   * @returns
   */
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

  /**
   * Gets the product routing exploded BOM
   * @param productSku
   * @param params
   * @returns
   */
  async function getProductRoutingBomV2(
    productSku: string,
    params?: Partial<ProductRoutingQueryParams>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: ProductRoutingBOM[] }>(
      `/api/bom/product-bom-for-consumption/${productSku}`,
      {
        params,
      },
    );

    return res?.data;
  }

  /**
   * @deprecated use getProductResources
   * @param productSku
   * @param loading
   * @returns
   */
  async function getProductTechnicalDrawings(
    productSku: string,
    loading: (loading: boolean) => void,
  ) {
    loading(true);
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ files: ProductAttachment[] }>(
      `api/sharepoint/get-technical-drawing/${productSku}`,
    );

    loading(false);
    return res?.files;
  }

  /**
   * @deprecated use getProductResources
   * @param productSku
   * @param loading
   * @returns
   */

  async function getProductPantoneReference(
    productSku: string,
    loading: (loading: boolean) => void,
  ) {
    loading(true);
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ files: ProductAttachment[] }>(
      `api/sharepoint/get-pantone/${productSku}`,
    );

    loading(false);
    return res?.files;
  }

  /**
   * @deprecated use getProductResources
   * @param productSku
   * @param loading
   * @returns
   */
  async function getProductAssemblyManual(
    productSku: string,
    loading: (loading: boolean) => void,
  ) {
    loading(true);
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ files: ProductAttachment[] }>(
      `api/sharepoint/get-assembly-manual/${productSku}`,
    );

    loading(false);
    return res?.files;
  }

  async function getProductResources(
    productSku: string,
    productResourceType: ProductResourceType,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<ProductResource[]>(
      `api/resources/${productSku}/${productResourceType}`,
    );
    return res;
  }

  async function getWorkCenters() {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: SimplePaginate<ProductRoutingWorkcenter> }>(
      "/api/work-centers",
    );

    if (res) {
      workCenters.value = res.data.data;

      return res.data;
    }
  }

  async function getBom(bomNo: string) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: ProductRoutingBOM }>(`/api/bom/${bomNo}`);

    if (res) {
      return res.data;
    }
  }

  async function getBoms(params?: ProductBomQueryParams) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: ProductRoutingBOM[] }>(
      `/api/bom/bom-line-list`,
      { params },
    );

    if (res) {
      return res.data;
    }
  }

  return {
    errors,
    loading,
    products,
    product,
    workCenters,
    filteredRoutings,
    invalidate,
    getProducts,
    getProduct,
    getProductRoutingBom,
    getProductRoutingBomV2,
    getProductTechnicalDrawings,
    getProductPantoneReference,
    getProductAssemblyManual,
    getProductResources,
    getWorkCenters,
    getBom,
    getBoms,
  };
});
