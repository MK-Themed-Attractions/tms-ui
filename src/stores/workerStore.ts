import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { useStorage } from "@vueuse/core";
import type { Worker, WorkerForm } from "@/types/workers";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import { computed } from "@vue/reactivity";
import type { AxiosRequestConfig } from "axios";

export const useWorkerStore = defineStore("workers", () => {
  const baseUrl = "http://192.168.110.21:9000";
  const bearerToken = useStorage("tms-workers-bearer-token", "");

  const { errors, get, loading, post } = useAxios({
    baseURL: baseUrl,
    headers: {
      "Bearer-Token": bearerToken.value,
    },
  });

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
  async function getWorkers(config?: AxiosRequestConfig) {
    await checkToken();

    const res = await get<SimplePaginateAPIResource<Worker>>(
      "/api/worker",
      config,
    );

    if (res) {
      paginatedResponse.value = res;
    }
  }

  async function createWorker(form: WorkerForm) {
    await checkToken();

    await post<WorkerForm, SimplePaginateAPIResource<Worker>>(
      "/api/worker",
      form,
    );
  }

  async function checkToken() {
    if (!bearerToken.value) {
      bearerToken.value = await authStore.checkTokenValidity(
        `${baseUrl}/api/auth/bearer-token`,
      );
    }
  }

  return {
    getWorkers,
    errors,
    loading,
    workers,
    paginatedResponse,
    createWorker,
  };
});
