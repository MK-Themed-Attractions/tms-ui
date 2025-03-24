import { useAxios } from "@/composables/useAxios";
import type {
  BearerTokenResponse,
  LoginCredential,
  LoginResponse,
  Permission,
  PermissionAttachPayload,
  PermissionPayload,
  Role,
  RolePayload,
  Token,
  User,
  UserPayload,
  UserPermissionAttachPayload,
  UserRole,
  UserRoleAttachPayload,
} from "@/types/auth";
import {
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

  const { errors, loading, post, get, setHeader, put, destroy, patch } =
    useAxios({
      baseURL: import.meta.env.VITE_USERS,
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
    if (!bearerToken.value && user.value) {
      const res = await post<any, BearerTokenResponse>(
        bearerEndPoint,
        {
          access_token: accessToken.value?.token ?? "",
          user_id: user.value.id,
          permissions: [
            "can-save-workers",
            "can-get-departments",
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
      "/api/auth/logout",
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
    localStorage.clear();

    router.push({ name: "login" });
  }

  async function getUsers() {
    const res = await get<{ data: User[] }>("/api/user");

    if (res) {
      return res.data;
    }
  }

  async function addUser(payload: UserPayload) {
    const res = await post("/api/user/register", payload);
  }
  async function updateUser(userId: string, payload: UserPayload) {
    const res = await put(`/api/user/update/${userId}`, payload);
  }

  async function resetPassword(userId: string) {
    const res = await put<unknown, { data: { new_password: string } }>(
      `/api/user/reset-password/${userId}`,
    );

    if (res) {
      return res.data.new_password;
    }
  }

  async function attachRoleToUser(
    userId: string,
    payload: UserRoleAttachPayload,
  ) {
    const res = await patch(`/api/user/attach-role/${userId}`, payload);
  }
  async function attachPermissionsToUser(
    userId: string,
    payload: UserPermissionAttachPayload,
  ) {
    const res = await patch(`/api/user/attach-permission/${userId}`, payload);
  }
  async function getUserPermissions(userId: string) {
    const res = await get<{ data: User }>(
      `/api/user/get-user-permission/${userId}`,
    );

    if (res?.data?.user_permissions) {
      return res.data.user_permissions;
    }
  }

  async function getUserRole(userId: string) {
    const res = await get<{ data: UserRole }>(
      `/api/user/get-attached-roles/${userId}`,
    );

    if (res?.data?.roles) {
      return res.data.roles[0];
    }
  }

  async function getPermissions() {
    const res = await get<{ permissions: SimplePaginate<Permission> }>(
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

  async function getRoles() {
    const res = await get<{ roles: SimplePaginate<Role> }>("/api/role");

    if (res) return res.roles.data;
  }

  async function addRole(payload: RolePayload) {
    const res = await post("/api/role", payload);
  }

  async function updateRole(roleId: string, payload: RolePayload) {
    const res = await put(`/api/role/${roleId}`, payload);
  }

  async function deleteRole(roleId: string) {
    const res = await destroy(`/api/role/${roleId}`);
  }

  async function attachPermissions(payload: PermissionAttachPayload) {
    const res = await patch("/api/role/attach-permissions", payload);
  }

  async function getRolePermissions(roleId: string) {
    const res = await get<{ data: Role }>(
      `/api/role/get-permissions/${roleId}`,
    );

    if (res) {
      return res.data;
    }
  }

  return {
    login,
    user,
    addUser,
    updateUser,
    getUsers,
    resetPassword,
    attachRoleToUser,
    attachPermissionsToUser,
    getUserRole,
    getUserPermissions,
    getPermissions,
    addPermission,
    updatePermission,
    deletePermission,
    getRoles,
    getRolePermissions,
    addRole,
    updateRole,
    deleteRole,
    attachPermissions,
    accessToken,
    refreshToken,
    errors,
    loading,
    checkTokenValidity,
    logout,
    invalidate,
  };
});
