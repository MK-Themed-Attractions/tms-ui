import { useAxios } from "@/composables/useAxios";
import type {
  Plan,
  PlanBatch,
  PlanBatchesForm,
  PlanBatchForm,
  PlanDataForm,
  PlanDeletePayload,
  PlanForm,
  PlanQueryParams,
} from "@/types/planning";
import { useStorage } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from "./authStore";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import { computed, ref } from "vue";
import {
  useSimplePaginate,
  useSimplePaginateAPIResource,
} from "@/composables/usePaginate";
import type { TaskHistory, TaskHistoryParams } from "@/types/taskHistory";

export const usePlanStore = defineStore("plans", () => {
  const baseUrl = import.meta.env.VITE_PLANNING;
  const bearerToken = useStorage(
    import.meta.env.VITE_PLANNING_BEARER_TOKEN_KEY,
    "",
  );
  const { get, errors, loading, setHeader, post, put, destroy } = useAxios({
    baseURL: baseUrl,
  });
  const {
    hasNextPage,
    hasPrevPage,
    items: plans,
    paginate: paginatedResponse,
  } = useSimplePaginateAPIResource<Plan>();
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  setHeader("Bearer-Token", bearerToken);

  const plan = ref<Plan>();
  const batch = ref<PlanBatch>();

  /* GETTERS */

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

    const res = await put(`/api/plan/${planId}`, {
      user_id: user.value.id,
      ...form,
    });
  }

  async function deletePlan(planId: string, payload: PlanDeletePayload) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await post(`/api/plan/${planId}`, payload, {
      params: {
        _method: "DELETE",
      },
    });
  }

  async function updatePlanBatch(
    planId: string,
    batchId: string,
    form: Partial<PlanBatch>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await put(`/api/plan/${planId}/batch/${batchId}`, form);
  }

  async function updatePlanBatches(planId: string, form: PlanBatchForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await put(`/api/plan/${planId}/batch/update`, {
      user_id: user.value.id,
      ...form,
    });
  }

  async function getBatch(
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
      batch.value = res?.data;

      //update the plan to reflect the new changes on batch
      if (plan.value && plan.value.batches) {
        const foundBatchIndex = plan.value.batches.findIndex(
          (b) => b.id === res.data.id,
        );
        if (foundBatchIndex !== -1) {
          plan.value.batches[foundBatchIndex] = res.data;
        }
      }
      return res.data;
    }
  }

  async function appendBatch(planId: string, form: PlanBatchesForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await post(`api/plan/${planId}/batch/append`, form);
  }

  async function appendTask(
    planId: string,
    batchId: string,
    form: Partial<{ qty: number; user_id: string; start_operation: string }>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await post(
      `api/plan/${planId}/batch/${batchId}/task/append`,
      form,
    );
  }

  async function getTaskHistory(params: Partial<TaskHistoryParams>) {
    const res = await get<{ data: TaskHistory[] }>("/api/task-history", {
      params,
    });

    if (res) {
      return res.data;
    }
  }

  return {
    paginatedResponse,
    plans,
    hasNextPage,
    hasPrevPage,
    plan,
    batch,
    getPlans,
    getPlan,
    deletePlan,
    getBatch,
    invalidate,
    createPlan,
    updatePlanData,
    updatePlanBatches,
    updatePlanBatch,
    appendBatch,
    appendTask,
    getTaskHistory,
    errors,
    loading,
  };
});
