import { useAxios } from "@/composables/useAxios";
import type { DepartmentKPI, DepartmentKPIQueryParams } from "@/types/qc";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore";

export const useQcStore = defineStore("qc", () => {
  const baseUrl = import.meta.env.VITE_QC_URL;
  const bearerToken = useStorage(import.meta.env.VITE_QC_BEARER_TOKEN_KEY, "");
  const { get, errors, loading, setHeader, post, patch } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  const departmentKPIs = ref<DepartmentKPI[]>();

  const authStore = useAuthStore();

  function invalidate() {
    bearerToken.value = null;
    departmentKPIs.value = undefined;
  }

  async function getDepartmentKPIs(params: DepartmentKPIQueryParams) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: DepartmentKPI[] }>(
      `/api/key-point-department/get-department-by-code-array`,
      { params },
    );

    if (res) {
      departmentKPIs.value = res.data;

      return res.data;
    }
  }

  return {
    invalidate,
    loading,
    errors,
    getDepartmentKPIs,
    departmentKPIs,
  };
});
