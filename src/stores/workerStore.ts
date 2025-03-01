import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { useStorage } from "@vueuse/core";
import type { Worker, WorkerForm, WorkerQueryParams } from "@/types/workers";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import { computed } from "@vue/reactivity";

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
      return [];
    }
  });

  const hasNextPage = computed(() => {
    return paginatedResponse.value?.links.next ? true : false;
  });

  const hasPrevPage = computed(() => {
    return paginatedResponse.value?.links.prev ? true : false;
  });

  /* ACTIONS */

  function invalidate() {
    paginatedResponse.value = null;
    bearerToken.value = null;
  }

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

  /**
   * Get individual worker by his/her RFID and automatically includes relationships
   * @param rfid_card Employee RFID card
   * @returns
   */

  async function getWorkerByRfid(rfid_card: string) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: Worker }>(`/api/worker/rfid/${rfid_card}`);

    if (res) {
      return res.data;
    }
  }
  /**
   * Get individual worker and automatically includes relationships
   * @param workerId worker UUID rfid_card Employee RFID card
   * @returns
   */
  async function getWorker(workerId: string) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: Worker }>(`/api/worker/${workerId}`);

    if (res) {
      return res.data;
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
    getWorker,
    getWorkerByRfid,
    errors,
    loading,
    workers,
    paginatedResponse,
    createWorker,
    updateWorker,
    deactivateWorker,
    bearerToken,
    hasNextPage,
    hasPrevPage,
    invalidate,
  };
});
