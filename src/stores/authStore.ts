import { useAxios } from "@/composables/useAxios";
import type { LoginCredential, LoginResponse, Token, User } from "@/types/auth";
import { StorageSerializers, useStorage } from "@vueuse/core";

import { defineStore } from "pinia";

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

  return {
    login,
    user,
    accessToken,
    refreshToken,
    errors,
    loading,
  };
});
