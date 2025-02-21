import { useAxios } from "@/composables/useAxios";
import type { SimplePaginate, SimplePaginateObject } from "@/types/pagination";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { computed, ref } from "vue";
import type { WipTask, WipTaskGrouped, WipTaskQueryParams } from "@/types/wip";

export const useWipStore = defineStore("wips", () => {
  const baseUrl = import.meta.env.VITE_COMMON_URL;
  const bearerToken = useStorage(
    import.meta.env.VITE_COMMON_BEARER_TOKEN_KEY,
    "",
  );
  const { get, errors, loading, setHeader, post, put } = useAxios({
    baseURL: baseUrl,
  });
  const paginatedResponse = ref<SimplePaginateObject<WipTaskGrouped>>();
  const authStore = useAuthStore();
  setHeader("Bearer-Token", bearerToken);

  /* GETTERS */
  const wipTasks = computed(() => paginatedResponse.value?.data);

  /* ACTIONS */
  function invalidate() {
    bearerToken.value = null;
  }

  async function getTasksByWorkCenters(params?: Partial<WipTaskQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: SimplePaginateObject<WipTaskGrouped> }>(
      "/api/tasks/get-task/bulk-parent-code",
      {
        params,
      },
    );

    if (res) {
      paginatedResponse.value = res.data;
      return res.data;
    }
  }

  return {
    invalidate,
    errors,
    loading,
    paginatedResponse,
    getTasksByWorkCenters,
    wipTasks,
  };
});
