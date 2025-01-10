import { ref } from "vue";
import { useAxios } from "@/composables/useAxios";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { useStorage } from "@vueuse/core";
import type { Worker } from "@/types/workers";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import { computed } from "@vue/reactivity";

export const useWorkerStore = defineStore("workers", () => {
  const baseUrl = "http://tms-workers.local";
  const { errors, get, loading, post } = useAxios({
    baseURL: baseUrl,
  });

  const authStore = useAuthStore();
  const bearerToken = useStorage("tms-workers-bearer-token", "");

  /**
   * paginatedResponse holds the raw response from api/worker
   */
  const paginatedResponse = ref<SimplePaginateAPIResource<Worker> | null>(null);

  const workers = computed(() => {
    if (paginatedResponse.value) {
      return paginatedResponse.value.data;
    } else {
      return null;
    }
  });

  async function getWorkers() {
    if (!bearerToken.value) {
      bearerToken.value = await authStore.checkTokenValidity(
        `${baseUrl}/api/auth/bearer-token`,
      );
    }

    const res = await get<SimplePaginateAPIResource<Worker>>("/api/worker", {
      headers: {
        "Bearer-Token": bearerToken.value,
      },
    });

    if (res) {
      paginatedResponse.value = res;
    }
  }

  return {
    getWorkers,
    errors,
    loading,
    workers,
    paginatedResponse,
  };
});
