import { useAxios } from "@/composables/useAxios";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import type {
  WorkerDepartment,
  WorkerDepartmentForm,
  WorkerDepartmentQueryParams,
} from "@/types/workers";
import { computed, ref } from "vue";

export const useWorkerDepartmentStore = defineStore("workerDepartment", () => {
  const baseUrl = import.meta.env.VITE_WORKERS_URL;
  const bearerToken = useStorage(
    import.meta.env.VITE_WORKER_BEARER_TOKEN_KEY,
    "",
  );
  const { errors, get, loading, post, setHeader } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  const authStore = useAuthStore();
  const paginatedResponse =
    ref<SimplePaginateAPIResource<WorkerDepartment> | null>(null);

  /* GETTERS */
  const departments = computed(() => {
    if (paginatedResponse.value) {
      return paginatedResponse.value.data;
    } else return null;
  });

  const hasNextPage = computed(() => {
    return paginatedResponse.value?.links.next ? true : false;
  });

  const hasPrevPage = computed(() => {
    return paginatedResponse.value?.links.prev ? true : false;
  });
  /* ACTIONS */
  async function getDepartments(params?: Partial<WorkerDepartmentQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<SimplePaginateAPIResource<WorkerDepartment>>(
      "/api/department",
      {
        params,
      },
    );

    if (res) {
      paginatedResponse.value = res;
    }
  }

  async function createDepartment(form: WorkerDepartmentForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await post<
      WorkerDepartmentForm,
      SimplePaginateAPIResource<WorkerDepartment>
    >("/api/department", form);
  }

  return {
    getDepartments,
    errors,
    loading,
    paginatedResponse,
    departments,
    createDepartment,
    hasNextPage,
    hasPrevPage,
  };
});
