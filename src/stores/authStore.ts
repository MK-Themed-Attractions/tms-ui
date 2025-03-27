import { useAxios } from "@/composables/useAxios";
import type {
  BearerTokenResponse,
  LoginCredential,
  LoginResponse,
  Permission,
  PermissionAttachPayload,
  PermissionPayload,
  PermissionQueryParams,
  Role,
  RolePayload,
  RoleQueryParams,
  RolePermission,
  Token,
  User,
  UserChangePassPayload,
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
import { useRouter } from "vue-router";
import { computed } from "vue";
import type { SimplePaginate } from "@/types/pagination";
import type { AxiosRequestConfig } from "axios";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const user = useStorage<User>("user", null, undefined, {
    serializer: StorageSerializers.object,
  });
  const roles = useStorage<Role[]>("roles", null, undefined, {
    serializer: StorageSerializers.object,
  });
  const rolesWithPermission = useStorage<Role[]>("roles-with-permission", []);
  const userDirectPermissions = useStorage<RolePermission[]>(
    "direct-permissions",
    null,
    undefined,
    {
      serializer: StorageSerializers.object,
    },
  );
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

  /* collection of user permissionkeys with microservices attached with it 
     NOTE: USE THIS to authorize user
  */
  const userPermissionSet = computed(() => {
    function getPermissions(permissions?: RolePermission[]): string[] {
      if (!permissions) return [];
      return permissions.flatMap((rp) =>
        rp.permissions.map((p) => `${rp.microservice}-${p.name}`),
      );
    }

    if (!rolesWithPermission.value.length) return [""];

    let rolePermissions: string[] = [];

    rolesWithPermission.value.forEach((rWithP) => {
      const permissions = getPermissions(rWithP.role_permissions);
      rolePermissions = [...rolePermissions, ...permissions];
    });

    const userPermissions = getPermissions(userDirectPermissions.value);

    return [...rolePermissions, ...userPermissions];
  });

  const userUIPermissionSet = computed(() => {
    return userPermissionSet.value
      .filter((permission) => permission.startsWith("ui-"))
      .map((permission) => permission.replace("ui-", "").toLowerCase());
  });

  function invalidate() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    roles.value = null;
    rolesWithPermission.value = null;
    userDirectPermissions.value = null;
  }

  async function login(payload: LoginCredential) {
    const res = await post<LoginCredential, LoginResponse>(
      "/api/auth/login",
      payload,
    );

    if (!res || errors.value) return;

    user.value = res.data;
    accessToken.value = res.token.access_token;
    refreshToken.value = res.token.refresh_token;

    /* get user roles */
    roles.value = await getUserRole(user.value.id, {
      headers: {
        "Access-Token": accessTokenValue.value,
      },
    });
    if (!roles.value) return;

    /* loop through each roles and get each role permissions */
    roles.value.forEach(async (role) => {
      const rolePermissions = await getRolePermissions(role.id, {
        headers: {
          "Access-Token": accessTokenValue.value,
        },
      });

      if (rolePermissions) {
        rolesWithPermission.value.push(rolePermissions);
      }
    });

    /* get user direct permissions */
    userDirectPermissions.value = await getUserPermissions(user.value.id, {
      headers: {
        "Access-Token": accessTokenValue.value,
      },
    });
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
          permissions: userPermissionSet.value,
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

  async function changePassword(
    userId: string,
    payload: UserChangePassPayload,
  ) {
    const res = await put(`/api/user/change-password/${userId}`, payload);

    if (res) {
      return res;
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
  async function getUserPermissions(
    userId: string,
    config?: AxiosRequestConfig,
  ) {
    const res = await get<{ data: User }>(
      `/api/user/get-user-permission/${userId}`,
      config,
    );

    if (res?.data?.user_permissions) {
      return res.data.user_permissions;
    }
  }

  async function getUserRole(userId: string, config?: AxiosRequestConfig) {
    const res = await get<{ data: UserRole }>(
      `/api/user/get-attached-roles/${userId}`,
      config,
    );

    if (res?.data?.roles) {
      return res.data.roles;
    }
  }

  async function getPermissions(params?: Partial<PermissionQueryParams>) {
    const res = await get<{ permissions: SimplePaginate<Permission> }>(
      "/api/permission",
      { params },
    );

    if (res) return res.permissions;
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

  async function getRoles(params?: Partial<RoleQueryParams>) {
    const res = await get<{ roles: SimplePaginate<Role> }>("/api/role", {
      params,
    });

    if (res) return res.roles;
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

  async function getRolePermissions(
    roleId: string,
    config?: AxiosRequestConfig,
  ) {
    const res = await get<{ data: Role }>(
      `/api/role/get-permissions/${roleId}`,
      config,
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
    changePassword,
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
    userPermissionSet,
    roles,
    rolesWithPermission,
    userUIPermissionSet
  };
});
