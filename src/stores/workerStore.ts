import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { useStorage } from "@vueuse/core";
import type { Worker, WorkerForm, WorkerQueryParams } from "@/types/workers";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import { computed } from "@vue/reactivity";
import type { AxiosRequestConfig } from "axios";

export const useWorkerStore = defineStore("workers", () => {
  const baseUrl = import.meta.env.VITE_WORKERS_URL;
  const bearerToken = useStorage(
    import.meta.env.VITE_WORKER_BEARER_TOKEN_KEY,
    "",
  );

  const { errors, get, loading, post, put, setHeader, destroy } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  const authStore = useAuthStore();

  /**
   * paginatedResponse holds the raw response from api/worker
   */
  const paginatedResponse = ref<SimplePaginateAPIResource<Worker> | null>(null);

  /* GETTERS*/
  const workers = computed(() => {
    if (paginatedResponse.value) {
      return paginatedResponse.value.data;
    } else {
      return null;
    }
  });

  /* ACTIONS */
  async function getWorkers(params?: Partial<WorkerQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<SimplePaginateAPIResource<Worker>>("/api/worker", {
      params,
    });

    if (res) {
      paginatedResponse.value = res;
    }
  }

  async function createWorker(form: WorkerForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await post<WorkerForm, SimplePaginateAPIResource<Worker>>(
      "/api/worker",
      form,
    );
  }

  async function updateWorker(workerId: string, form: WorkerForm) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    //manually set is_active to true this is based on the API requirement
    form.is_active = true;
    await put(`/api/worker/${workerId}`, form);
  }

  async function deactivateWorker(workers: Worker[]) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    /*collect workers Id */
    const workerIds = workers.reduce<string[]>((acc, cur) => {
      acc.push(cur.id);
      return acc;
    }, []);

    await destroy("/api/workers/deactivate", {
      params: { worker_ids: workerIds },
    });
  }

  return {
    getWorkers,
    errors,
    loading,
    workers,
    paginatedResponse,
    createWorker,
    updateWorker,
    deactivateWorker,
    bearerToken,
  };
});
