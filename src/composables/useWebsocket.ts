import { useAuthStore } from "@/stores/authStore";
import { usePlanStore } from "@/stores/planStore";
import type { Notification } from "@/types/notification";
import type { Plan, PlanBatch } from "@/types/planning";
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
      handlePlanningEvent(message);
    });
  }

  function handlePlanningEvent(message: Notification<Plan>) {
    const planStore = usePlanStore();
    const { paginatedResponse, plan } = storeToRefs(planStore);

    switch (message.data.type) {
      case "plan create":
        planStore.getPlans().then((value) => {
          if (value) paginatedResponse.value = value;

          notifyPlanCreate(message);
        });

        break;
      case "batch create":
        if (message.data.data)
          planStore
            .getPlan(message.data.data?.id, { includes: "batches" })
            .then((value) => {
              plan.value = value;

              notifyBatchCreate(message);
            });

        break;
      default:
        break;
    }
  }

  function notifyPlanCreate(message: Notification<Plan>) {
    toast("Plan Info", {
      description: h("p", null, message.data.message),
    });
  }

  function notifyBatchCreate(message: Notification<Plan>) {
    toast("Batch Info", {
      description: message.data.message,
    });
  }

  return {
    init,
  };
};
