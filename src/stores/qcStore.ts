import { useAxios } from "@/composables/useAxios";
import type {
  DepartmentKPI,
  DepartmentKPIQueryParams,
  KPI,
  KPIPayload,
  KPIQueryParams,
} from "@/types/qc";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./authStore";
import type { SimplePaginateAPIResource } from "@/types/pagination";

export const useQcStore = defineStore("qc", () => {
  const baseUrl = import.meta.env.VITE_QC_URL;
  const bearerToken = useStorage(import.meta.env.VITE_QC_BEARER_TOKEN_KEY, "");
  const { get, errors, loading, setHeader, post, patch } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  const departmentKPIs = ref<DepartmentKPI[]>();
  const kpiPaginated = ref<SimplePaginateAPIResource<KPI>>();

  const authStore = useAuthStore();

  function invalidate() {
    bearerToken.value = null;
    departmentKPIs.value = undefined;
    kpiPaginated.value = undefined;
  }

  /* GETTERS */
  const kpis = computed(() => kpiPaginated.value?.data);
  const hasNextPage = computed(() =>
    kpiPaginated.value?.links.next ? true : false,
  );
  const hasPrevPage = computed(() =>
    kpiPaginated.value?.links.prev ? true : false,
  );

  async function getDepartmentKPIs(params?: Partial<DepartmentKPIQueryParams>) {
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

  async function getKPIs(params?: Partial<KPIQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<SimplePaginateAPIResource<KPI>>("api/key-point", {
      params,
    });

    if (res) {
      kpiPaginated.value = res;
      return res.data;
    }
  }

  async function addKpi(payload: KPIPayload) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await post("/api/key-point", payload);
  }

  return {
    invalidate,
    loading,
    errors,
    getDepartmentKPIs,
    departmentKPIs,
    getKPIs,
    addKpi,
    kpiPaginated,
    kpis,
    hasNextPage,
    hasPrevPage,
  };
});
