import { useAxios } from "@/composables/useAxios";
import type {
  BearerTokenResponse,
  LoginCredential,
  LoginResponse,
  Token,
  User,
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

export const useAuthStore = defineStore("auth", () => {
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

  const { errors, loading, post } = useAxios({
    baseURL: import.meta.env.VITE_USERS_URL,
  });

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
  }

  return {
    login,
    user,
    accessToken,
    refreshToken,
    errors,
    loading,
    checkTokenValidity,
    logout,
    invalidate,
  };
});
