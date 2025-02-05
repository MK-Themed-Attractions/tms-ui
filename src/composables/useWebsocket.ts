import { useAuthStore } from "@/stores/authStore";
import { usePlanStore } from "@/stores/planStore";
import type { Notification } from "@/types/notification";
import type { Plan } from "@/types/planning";
import { storeToRefs } from "pinia";
import { h } from "vue";
import { toast } from "vue-sonner";

export const useWebsocket = () => {
  async function init() {
    const authStore = useAuthStore();
    const { user } = storeToRefs(authStore);

    if (!user.value) {
      console.warn("No user found, skipping websocket initialization");
      return;
    }

    // Connect to Ably with your API key
    const realtime = new Ably.Realtime.Promise(
      import.meta.env.VITE_ABLY_PUBLIC_KEY,
    );

    // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
    const channel = realtime.channels.get(`notifications.${user.value.id}`);

    await channel.subscribe("planning", (message: Notification<Plan>) => {
      handlePlanReceived(message);
    });
  }

  function handlePlanReceived(message: Notification<Plan>) {
    const planStore = usePlanStore();
    const { paginatedResponse } = storeToRefs(planStore);
    toast(message.data.message, {
      description: h("p", null, [
        "Plan with code ",
        h("span", { class: "font-medium" }, message.data.data?.plan_data.code),
        " has been created.",
      ]),
      duration: 5000,
    });

    planStore.getPlans().then((value) => {
      if (value) paginatedResponse.value = value;
    });
  }

  return {
    init,
  };
};
