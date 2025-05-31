import { useAxios } from "@/composables/useAxios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./authStore";

import type {
  CustomLabel,
  CustomLabelQueryParams,
  CustomLabelPostPayload,
  CustomLabelDataPostPayload,
} from "@/types/customLabel";

import {
  type SimplePaginate,
  type SimplePaginateAPIResource,
} from "@/types/pagination";
import type {} from "@/types/customLabel";
import { useStorage } from "@vueuse/core";
import {
  useSimplePaginate,
  useSimplePaginateAPIResource,
} from "@/composables/usePaginate";

export const useCustomLabelStore = defineStore("customLabel", () => {
  const baseUrl = import.meta.env.VITE_PRODUCT;
  const authStore = useAuthStore();
  const bearerToken = useStorage(
    import.meta.env.VITE_PRODUCT_BEARER_TOKEN_KEY,
    "",
  );
  const { errors, loading, get, put, post, setHeader } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);
  const customLabel = ref<CustomLabel>();
  const cLabels = ref<CustomLabel[]>;
  const {
    hasNextPage,
    hasPrevPage,
    items: customLabels,
    paginate: paginatedResponse,
  } = useSimplePaginateAPIResource<CustomLabel>();

  /* GETTERS */

  /* ACTIONS */
  async function getCustomLabels(params?: Partial<CustomLabelQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await get<SimplePaginateAPIResource<CustomLabel>>(
      "/api/custom-label",
      {
        params,
      },
    );
    if (res) {
      paginatedResponse.value = res;
      return res;
    }
    return null;
  }
  async function getCustomLabel(
    id: string,
    params?: Partial<CustomLabelQueryParams>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await get<{ data: CustomLabel }>(`/api/custom-label/${id}`, {
      params,
    });
    if (res) {
      customLabel.value = res.data;
    }

    return res?.data;
  }
  async function saveCustomLabel(form: CustomLabelPostPayload) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await post(`/api/custom-label`, {
      ...form,
    });
    return res;
  }
  async function updateCustomLabel(form: CustomLabel) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await put(`/api/custom-label/${form.id}`, {
      ...form,
    });
    return res;
  }
  async function saveCustomLabelData(
    custom_label_id: string,
    form: CustomLabelDataPostPayload,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await post(`/api/custom-label-data/${custom_label_id}`, {
      ...form,
    });
    return res;
  }
  async function updateCustomLabelData(
    custom_label_id: string,
    form: CustomLabelDataPostPayload,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await put(`/api/custom-label-data/${custom_label_id}`, {
      ...form,
    });
    return res;
  }

  /* CustomLabel Data */
  return {
    errors,
    loading,
    customLabel,
    customLabels,
    hasNextPage,
    hasPrevPage,
    saveCustomLabel, // POST
    updateCustomLabel, // PUT
    getCustomLabels, //
    getCustomLabel,
    saveCustomLabelData,
    updateCustomLabelData,
  };
});
