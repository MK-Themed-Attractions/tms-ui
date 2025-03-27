import { useAxios } from "@/composables/useAxios";
import { useStorage } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { useAuthStore } from "./authStore";
import type { SimplePaginateAPIResource } from "@/types/pagination";
import type {
  WorkerDepartment,
  WorkerDepartmentForm,
  WorkerDepartmentQueryParams,
} from "@/types/workers";
import { computed, ref } from "vue";

export const useWorkerDepartmentStore = defineStore("workerDepartment", () => {
  const baseUrl = import.meta.env.VITE_WORKERS;
  const bearerToken = useStorage(
    import.meta.env.VITE_WORKERS_BEARER_TOKEN_KEY,
    "",
  );
  const { errors, get, loading, post, setHeader, put } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  const authStore = useAuthStore();
  const { userUIPermissionSet, user } = storeToRefs(authStore);
  const paginatedResponse =
    ref<SimplePaginateAPIResource<WorkerDepartment> | null>(null);

  /* GETTERS */
  //list of departments without filtering permissions (clean/raw)
  const rawDepartments = computed(() => {
    if (paginatedResponse.value) {
      return paginatedResponse.value.data;
    } else return null;
  });

  //list of department with applied user permissions
  const departments = computed(() => {
    if (rawDepartments.value && userUIPermissionSet.value) {
      const superAdminIds = <string[]>(
        JSON.parse(import.meta.env.VITE_SUPERADMIN_IDS)
      );

      return rawDepartments.value.filter((department) => {
        return (
          userUIPermissionSet.value.includes(department.code.toLowerCase()) ||
          superAdminIds.includes(user.value.id)
        );
      });
    } else return null;
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

  function getWorkCentersByDeptId(deptId: string) {
    return departments.value?.find((d) => d.id === deptId)?.work_centers;
  }

  /**
   *
   * @param workCenters array of workCenter code
   */
  function getDepartmentByWorkCenters(workCenters: string[]) {
    const result: WorkerDepartment[] = [];
    const seen = new Set<string>(); // To track unique department IDs

    departments.value?.forEach((department) => {
      if (department.work_centers.some((wc) => workCenters.includes(wc))) {
        if (!seen.has(department.id)) {
          seen.add(department.id);
          result.push(department);
        }
      }
    });

    return result;
  }

  /**
   * Get department by work center code in a {id:string;department:string} form
   * @param workCenter workCenter code
   * @returns string[]
   */
  function getDepartmentCodeIdByWorkCenter(workCenter: string) {
    const dept = departments.value?.find((d) =>
      d.work_centers.includes(workCenter),
    );

    if (dept) {
      return {
        department: workCenter,
        id: dept.id,
      };
    }
  }
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
  async function updateDepartment(
    workerDepartmentId: string,
    form: WorkerDepartmentForm,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await put(`/api/department/${workerDepartmentId}`, form);
  }

  return {
    getWorkCentersByDeptId,
    getDepartmentByWorkCenters,
    getDepartmentCodeIdByWorkCenter,
    getDepartments,
    errors,
    loading,
    paginatedResponse,
    departments,
    createDepartment,
    updateDepartment,
    hasNextPage,
    hasPrevPage,
    invalidate,
  };
});
