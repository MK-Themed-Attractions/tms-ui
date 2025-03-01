import { useAxios } from "@/composables/useAxios";
import type { SimplePaginate, SimplePaginateObject } from "@/types/pagination";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { computed, ref } from "vue";
import type {
  WipTask,
  WipTaskGrouped,
  WipPlanQueryParams,
  WipTaskQueryParams,
} from "@/types/wip";

export const useWipStore = defineStore("wips", () => {
  const baseUrl = import.meta.env.VITE_COMMON_URL;
  const bearerToken = useStorage(
    import.meta.env.VITE_COMMON_BEARER_TOKEN_KEY,
    "",
  );
  const { get, errors, loading, setHeader, post, put } = useAxios({
    baseURL: baseUrl,
  });

  const paginatedResponse = ref<SimplePaginate<WipTaskGrouped>>();

  const authStore = useAuthStore();
  setHeader("Bearer-Token", bearerToken);

  /* GETTERS */
  const wipTasksGrouped = computed(() => paginatedResponse.value?.data);

  /* ACTIONS */
  function invalidate() {
    bearerToken.value = null;
  }

  async function getWipPlansByWorkCenters(
    params?: Partial<WipPlanQueryParams>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<SimplePaginate<WipTaskGrouped>>(
      "/api/tasks/get-ongoing-plans",
      {
        params,
      },
    );

    if (res) {
      paginatedResponse.value = res;
      return res.data;
    }
  }
  async function getTasksByBatchId(
    batchId: string,
    params?: Partial<WipTaskQueryParams>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: WipTask[] }>(
      `api/tasks/get-batch-tasks/${batchId}`,
      {
        params,
      },
    );

    if (res) {
      return res.data;
    }
  }

  async function assignWorkersToTasks(payload: {
    workers: string[];
    tasks: string[];
  }) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await post("/api/tasks/mass-assign-workers", payload);
  }

  /**
   * Get fully detailed task
   * @param planTaskId - task id on Plan microservice
   */
  async function getWipTask(planTaskId: string) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: WipTask }>(
      `/api/tasks/get-task-details-by-plan-task/${planTaskId}`,
    );

    if (res) {
      return res.data;
    }
  }

  return {
    invalidate,
    errors,
    loading,
    paginatedResponse,
    getWipPlansByWorkCenters,
    getTasksByBatchId,
    getWipTask,
    assignWorkersToTasks,
    wipTasksGrouped,
  };
});
