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

  const paginatedResponse = ref<SimplePaginate<WipTask>>();

  const authStore = useAuthStore();
  setHeader("Bearer-Token", bearerToken);

  /* GETTERS */
  const wipTasks = computed(() => paginatedResponse.value?.data);

  /* grouped wiptask according to their parent_sku > sku > plan > batch */
  const wipTasksGrouped = computed(() => {
    /* return when wipTasks is empty */
    if (!wipTasks?.value) return;

    let grouped: WipTaskGrouped = {};

    /* group by parent_sku > sku > plan_id > batch_id */
    grouped = wipTasks.value.reduce<WipTaskGrouped>((acc, task) => {
      const { parent_code, sku, plan_id, batch_id } = task;

      /* initilize an empty object on each grouped key */
      if (!acc[parent_code]) acc[parent_code] = {};
      if (!acc[parent_code][sku]) acc[parent_code][sku] = {};
      if (!acc[parent_code][sku][plan_id]) acc[parent_code][sku][plan_id] = {};
      if (!acc[parent_code][sku][plan_id][batch_id])
        acc[parent_code][sku][plan_id][batch_id] = []; //this is array since we will be pushing WipTasks here

      /* push each task to their corresponding groups */
      acc[parent_code][sku][plan_id][batch_id].push(task);

      return acc;
    }, {});

    /* sort by task_index*/
    Object.values(grouped).forEach((skuGroup) => {
      Object.values(skuGroup).forEach((planGroup) => {
        Object.values(planGroup).forEach((batchGroup) => {
          Object.values(batchGroup).forEach((tasks) => {
            tasks.sort((a, b) => a.task_index - b.task_index);
          });
        });
      });
    });

    return grouped;
  });

  /* ACTIONS */
  function invalidate() {
    bearerToken.value = null;
  }

  async function getTasksByWorkCenters(params?: Partial<WipTaskQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: SimplePaginate<WipTask> }>(
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
    wipTasksGrouped,
  };
});
