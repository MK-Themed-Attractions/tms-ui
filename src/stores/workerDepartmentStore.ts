import { useAxios } from "@/composables/useAxios";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import type { WorkerDepartment } from "@/types/workers";
import { computed, ref } from "vue";

export const useWorkerDepartmentStore = defineStore("workerDepartment", () => {
  const baseUrl = "http://tms-workers.local";

  const { errors, get, loading, post } = useAxios({
    baseURL: baseUrl,
  });
  const bearerToken = useStorage("tms-workers-bearer-token", "");
  const authStore = useAuthStore();
  const paginatedResponse =
    ref<SimplePaginateAPIResource<WorkerDepartment> | null>(null);

  /* GETTERS */
  const departments = computed(() => {
    if (paginatedResponse.value) {
      return paginatedResponse.value.data;
    } else return null;
  });

  /* ACTIONS */
  async function getDepartments() {
    if (!bearerToken.value) {
      authStore.checkTokenValidity(`${baseUrl}/api/auth/bearer-token`);
    }

    const res = await get<SimplePaginateAPIResource<WorkerDepartment>>(
      "/api/department",
      {
        headers: {
          "Bearer-Token": bearerToken.value,
        },
      },
    );

    if (res) {
      paginatedResponse.value = res;
    }
  }

  return {
    getDepartments,
    errors,
    loading,
    paginatedResponse,
    departments,
  };
});
