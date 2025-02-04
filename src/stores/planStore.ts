import { useAxios } from "@/composables/useAxios";
import type { Plan, PlanForm, PlanQueryParams } from "@/types/planning";
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
  const { get, errors, loading, setHeader, post } = useAxios({
    baseURL: baseUrl,
  });
  const paginatedResponse = ref<SimplePaginateAPIResource<Plan>>();
  const authStore = useAuthStore();
  setHeader("Bearer-Token", bearerToken);

  /* GETTERS */
  const plans = computed(() => paginatedResponse.value?.data);

  function invalidate() {
    paginatedResponse.value = undefined;
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

  async function createPlan(form: PlanForm) {
    const res = await post("api/plan", form);
  }

  return {
    plans,
    getPlans,
    invalidate,
    createPlan,
  };
});
