import { useAxios } from "@/composables/useAxios";
import type {
  GetNotificationsQueryParams,
  Notification,
} from "@/types/notification";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./authStore";
import type { SimplePaginate } from "@/types/pagination";

export const useNotificationStore = defineStore("notifications", () => {
  const baseUrl = import.meta.env.VITE_NOTIFICATIONS;
  const bearerToken = useStorage(
    import.meta.env.VITE_NOTIFICATIONS_BEARER_TOKEN_KEY,
    "",
  );

  const { get, errors, loading, setHeader, post, put, destroy } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);

  const authStore = useAuthStore();

  const notificationRaw = ref<SimplePaginate<Notification>>();

  /* GETTERS */
  const invalidate = () => {
    notificationRaw.value = undefined;
    bearerToken.value = null;
  };
  const notifications = computed(() => notificationRaw.value?.data);

  const getNotifications = async (params?: GetNotificationsQueryParams) => {
    try {
      await authStore.checkTokenValidity(
        `${baseUrl}/api/auth/bearer-token`,
        bearerToken,
      );

      const res = await get<{ data: SimplePaginate<Notification> }>(
        "/api/notifications",
        {
          params,
        },
      );

      if (res) {
        notificationRaw.value = res.data;
        return res;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    invalidate,
    getNotifications,
    notificationRaw,
    notifications,
    loading,
    errors,
  };
});
