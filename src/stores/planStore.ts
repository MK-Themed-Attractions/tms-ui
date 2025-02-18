import { useAxios } from "@/composables/useAxios";
import type {
  Plan,
  PlanBatch,
  PlanBatchForm,
  PlanDataForm,
  PlanForm,
  PlanQueryParams,
} from "@/types/planning";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import { computed, ref } from "vue";

export const usePlanStore = defineStore("plans", () => {
  const baseUrl = import.meta.env.VITE_PLANNING_URL;
  const bearerToken = useStorage(
    import.meta.env.VITE_PLANNING_BEARER_TOKEN_KEY,
    "",
  );
  const { get, errors, loading, setHeader, post, put } = useAxios({
    baseURL: baseUrl,
  });
  const paginatedResponse = ref<SimplePaginateAPIResource<Plan>>();
  const authStore = useAuthStore();
  setHeader("Bearer-Token", bearerToken);

  const plan = ref<Plan>();

  /* GETTERS */
  const plans = computed(() => paginatedResponse.value?.data);

  function invalidate() {
    paginatedResponse.value = undefined;
    plan.value = undefined;
    bearerToken.value = null;
  }

  /* ACTIONS */
  async function getPlans(params?: Partial<PlanQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<SimplePaginateAPIResource<Plan>>("/api/plan", {
      params,
    });

    if (res) {
      paginatedResponse.value = res;
      return res;
    }

    return null;
  }
  async function getPlan(planId: string, params?: Partial<PlanQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: Plan }>(`/api/plan/${planId}`, { params });

    if (res) {
      plan.value = res.data;
    }

    return res?.data;
  }

  async function createPlan(form: PlanForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await post("api/plan", form);
  }

  async function updatePlanData(planId: string, form: PlanDataForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await put(`/api/plan/${planId}`, form);
  }

  async function updatePlanBatches(planId: string, form: PlanBatchForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await put(`/api/plan/${planId}/batch/update`, form);
  }

  async function getTasks(
    planId: string,
    batchId: string,
    params?: Partial<PlanQueryParams>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: PlanBatch }>(
      `/api/plan/${planId}/batch/${batchId}`,
      { params },
    );

    if (res) {
      return res.data;
    }
  }

  async function appendBatch(planId: string, form: PlanBatchForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await post(`api/plan/${planId}/batch/append`, form);
  }

  return {
    paginatedResponse,
    plans,
    plan,
    getPlans,
    getPlan,
    getTasks,
    invalidate,
    createPlan,
    updatePlanData,
    updatePlanBatches,
    appendBatch,
    errors,
    loading,
  };
});
