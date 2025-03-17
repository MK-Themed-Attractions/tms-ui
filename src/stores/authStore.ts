import { useAxios } from "@/composables/useAxios";
import type {
  BearerTokenResponse,
  LoginCredential,
  LoginResponse,
  PermissionPayload,
  Role,
  Token,
  User,
} from "@/types/auth";
import {
  get,
  StorageSerializers,
  useStorage,
  type MaybeRefOrGetter,
} from "@vueuse/core";

import { defineStore } from "pinia";
import { useProductStore } from "./productStore";
import { useWorkerDepartmentStore } from "./workerDepartmentStore";
import { useWorkerStore } from "./workerStore";
import { usePlanStore } from "./planStore";
import { useWipStore } from "./wipStore";
import { useQcStore } from "./qcStore";
import { useRouter } from "vue-router";
import { computed } from "vue";
import type { SimplePaginate } from "@/types/pagination";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const user = useStorage<User>("user", null, undefined, {
    serializer: StorageSerializers.object,
  });
  const accessToken = useStorage<Token | null>(
    "access-token",
    null,
    undefined,
    {
      serializer: StorageSerializers.object,
    },
  );
  const refreshToken = useStorage<Token | null>(
    "refresh-token",
    null,
    undefined,
    {
      serializer: StorageSerializers.object,
    },
  );

  const { errors, loading, post, get, setHeader, put, destroy } = useAxios({
    baseURL: import.meta.env.VITE_USERS_URL,
  });
  const accessTokenValue = computed(() => accessToken.value?.token);
  setHeader("Access-Token", accessTokenValue);

  function invalidate() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
  }

  async function login(payload: LoginCredential) {
    const res = await post<LoginCredential, LoginResponse>(
      "/api/auth/login",
      payload,
    );

    user.value = res?.data;
    accessToken.value = res?.token.access_token;
    refreshToken.value = res?.token.refresh_token;
  }

  async function checkTokenValidity(
    bearerEndPoint: string,
    bearerToken: MaybeRefOrGetter,
  ) {
    if (!bearerToken.value) {
      const res = await post<any, BearerTokenResponse>(
        bearerEndPoint,
        {
          access_token: accessToken.value?.token ?? "",
          user_id: user.value.id,
          permissions: [
            "can-create-product",
            "can-update-product",
            "can-attach-user-permission",
            "can-attach-user-role",
            "can-update-role",
            "can-update-permission",
            "can-create-worker",
            "can-update-worker",
            "can-create-department",
            "can-update-department",
            "can-set-worker-department",
            "can-unset-worker-department",
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          baseURL: "/",
        },
      );

      bearerToken.value = res?.bearer_token;
    }
  }

  async function logout() {
    await post(
      "api/auth/logout",
      { id: user.value.id },
      {
        headers: {
          "Access-Token": accessToken.value?.token,
        },
      },
    );
    invalidate();

    /* invalidate other store to clear their bearer tokens and data */
    useProductStore().invalidate();
    useWorkerDepartmentStore().invalidate();
    useWorkerStore().invalidate();
    usePlanStore().invalidate();
    useWipStore().invalidate();
    useQcStore().invalidate();

    router.push({ name: "login" });
  }

  async function getUsers() {
    const res = await get<{ data: User[] }>("/api/user");

    if (res) {
      return res.data;
    }
  }

  async function getRoles() {
    const res = await get<{ roles: SimplePaginate<Role> }>("/api/role");

    if (res) return res.roles.data;
  }

  async function getPermissions() {
    const res = await get<{ permissions: SimplePaginate<Role> }>(
      "/api/permission",
    );

    if (res) return res.permissions.data;
  }

  async function addPermission(payload: PermissionPayload) {
    const res = await post("/api/permission", payload);
  }

  async function updatePermission(
    permissionId: string,
    payload: PermissionPayload,
  ) {
    const res = await put(`/api/permission/${permissionId}`, payload);
  }

  async function deletePermission(permissionId: string) {
    const res = await destroy(`/api/permission/${permissionId}`);
  }

  return {
    login,
    user,
    getUsers,
    getRoles,
    getPermissions,
    addPermission,
    updatePermission,
    deletePermission,
    accessToken,
    refreshToken,
    errors,
    loading,
    checkTokenValidity,
    logout,
    invalidate,
  };
});
