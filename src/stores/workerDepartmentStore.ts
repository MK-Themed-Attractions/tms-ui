import { useAxios } from "@/composables/useAxios";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import type { WorkerDepartment, WorkerDepartmentForm } from "@/types/workers";
import { computed, ref } from "vue";

export const useWorkerDepartmentStore = defineStore("workerDepartment", () => {
  const baseUrl = "http://tms-workers.local";
  const bearerToken = useStorage("tms-workers-bearer-token", "");
  const { errors, get, loading, post } = useAxios({
    baseURL: baseUrl,
    headers: {
      "Bearer-Token": bearerToken.value,
    },
  });

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
    await checkToken();

    const res =
      await get<SimplePaginateAPIResource<WorkerDepartment>>("/api/department");

    if (res) {
      paginatedResponse.value = res;
    }
  }

  async function createDepartment(form: WorkerDepartmentForm) {
    await checkToken();

    await post<
      WorkerDepartmentForm,
      SimplePaginateAPIResource<WorkerDepartment>
    >("/api/department", form);
  }

  async function checkToken() {
    if (!bearerToken.value) {
      await authStore.checkTokenValidity(`${baseUrl}/api/auth/bearer-token`);
    }
  }

  return {
    getDepartments,
    errors,
    loading,
    paginatedResponse,
    departments,
    createDepartment,
  };
});
