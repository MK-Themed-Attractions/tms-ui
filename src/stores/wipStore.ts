import { useAxios } from "@/composables/useAxios";
import type { SimplePaginate, SimplePaginateObject } from "@/types/pagination";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { computed, ref, watch } from "vue";
import type {
  WipTask,
  WipTaskGrouped,
  WipPlanQueryParams,
  WipTaskQueryParams,
  TaskStatus,
  WipPlan,
  WorkerTasksQueryParams,
} from "@/types/wip";
import type { DepartmentKPIPayload } from "@/types/qc";
import type { ProductRoutingWorkCenterType } from "@/types/products";
import type { PlanQueryParams } from "@/types/planning";

export const useWipStore = defineStore("wips", () => {
  const baseUrl = ref(import.meta.env.VITE_COMMON);
  let bearerToken = useStorage(
    import.meta.env.VITE_COMMON_BEARER_TOKEN_KEY,
    "",
  );

  const {
    get,
    errors,
    loading,
    setHeader,
    post,
    patch,
    axios: axiosInstance,
  } = useAxios({
    baseURL: baseUrl.value,
  });

  const paginatedResponse = ref<SimplePaginate<WipTaskGrouped>>();

  const authStore = useAuthStore();
  setHeader("Bearer-Token", bearerToken);

  /* GETTERS */
  const wipTasksGrouped = computed(() => paginatedResponse.value?.data);

  /* ACTIONS */
  function invalidate() {
    bearerToken.value = null;
    paginatedResponse.value = undefined;
  }

  /**
   * Point all API functions to a specific microservice, when not set, it will use the base
   * URL that was set on this store.
   * @param ms_url VITE ENV key
   */
  function pointToMicroservice(ms_url: string | undefined) {
    if (!ms_url || typeof ms_url === "undefined") return;

    axiosInstance.defaults.baseURL = import.meta.env[ms_url];
    baseUrl.value = import.meta.env[ms_url];
    const selectedBearerTokenKey = ms_url + "_BEARER_TOKEN_KEY";
    bearerToken = useStorage(import.meta.env[selectedBearerTokenKey], "");
    setHeader("Bearer-Token", bearerToken);
  }

  function reset() {
    paginatedResponse.value = undefined;
  }

  async function getWipPlansByWorkCenters(
    params?: Partial<WipPlanQueryParams>,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl.value}/api/auth/bearer-token`,
      bearerToken,
    );

    if (params) params.is_accessible = params.is_accessible ? 1 : 0;

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
      `${baseUrl.value}/api/auth/bearer-token`,
      bearerToken,
    );

    if (params) params.is_accessible = params.is_accessible ? 1 : 0;

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
    tasks: string[];
    workers: string[];
  }) {
    await authStore.checkTokenValidity(
      `${baseUrl.value}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await post("/api/tasks/mass-assign-workers", payload);
  }

  async function unassignWorkersFromTasks(payload: {
    workers: string[];
    tasks: string[];
  }) {
    await authStore.checkTokenValidity(
      `${baseUrl.value}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await post("/api/tasks/mass-un-assign-workers", payload, {
      params: {
        _method: "DELETE",
      },
    });
  }

  /**
   * Get fully detailed task
   * @param planTaskId - task id on Plan microservice
   */
  async function getWipTask(
    planTaskId: string,
    workCenters: ProductRoutingWorkCenterType,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl.value}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: WipTask }>(
      `/api/tasks/get-task-details-by-plan-task/${planTaskId}/${workCenters}`,
    );

    if (res) {
      return res.data;
    }
  }

  /**
   * Change the status of the WIP task
   * @param taskId WIP task id
   */
  async function changeTaskStatus(
    taskId: string,
    payload: { status: TaskStatus | "start" | "pause" },
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl.value}/api/auth/bearer-token`,
      bearerToken,
    );

    await patch(`/api/tasks/change-status/${taskId}`, payload);
  }
  /**
   * Change the status of the WIP task
   * @param taskId WIP task id
   */
  async function changeTaskStatusArray(payload: {
    status: TaskStatus | "start" | "pause";
    tasks: string[];
  }) {
    await authStore.checkTokenValidity(
      `${baseUrl.value}/api/auth/bearer-token`,
      bearerToken,
    );

    await patch("/api/tasks/mass-change-status", payload);
  }

  async function changeTaskQCStatus(
    taskId: string,
    payload: DepartmentKPIPayload,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl.value}/api/auth/bearer-token`,
      bearerToken,
    );

    await patch(`/api/tasks/qc-change-status/${taskId}`, payload);
  }

  async function getWorkerTasks(
    workerId: string,
    params?: Partial<WorkerTasksQueryParams>,
  ) {
    //no need for token verification as this endpoint is open

    const res = await get<SimplePaginate<WipPlan>>(
      `/api/task-workers/${workerId}`,
      {
        params: {
          filter: "all",
          ...params,
        },
      },
    );

    if (res) {
      return res;
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
    unassignWorkersFromTasks,
    wipTasksGrouped,
    changeTaskStatus,
    changeTaskStatusArray,
    changeTaskQCStatus,
    reset,
    pointToMicroservice,
    getWorkerTasks,
  };
});
