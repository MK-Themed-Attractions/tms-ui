import { useAxios } from "@/composables/useAxios";
import type {
  BearerTokenPayload,
  BearerTokenResponse,
  LoginCredential,
  LoginResponse,
  Token,
  User,
} from "@/types/auth";
import { StorageSerializers, useStorage } from "@vueuse/core";

import { defineStore } from "pinia";
import axios, { type AxiosResponse } from "axios";

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
    baseURL: "http://tms-users.local",
  });

  async function login(payload: LoginCredential) {
    const res = await post<LoginCredential, LoginResponse>(
      "/api/auth/login",
      payload,
    );

    user.value = res?.data;
    accessToken.value = res?.token.access_token;
    refreshToken.value = res?.token.refresh_token;
  }

  async function checkTokenValidity(bearerEndPoint: string) {
    const res = await axios.post<
      BearerTokenResponse,
      AxiosResponse<BearerTokenResponse>,
      BearerTokenPayload
    >(
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
      },
    );

    return res.data.bearer_token;
  }

  return {
    login,
    user,
    accessToken,
    refreshToken,
    errors,
    loading,
    checkTokenValidity,
  };
});
