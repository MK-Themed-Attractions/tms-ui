import { useAuthStore } from "@/stores/authStore";
import { usePlanStore } from "@/stores/planStore";
import type { Notification } from "@/types/notification";
import type { Plan, PlanBatch } from "@/types/planning";
import { storeToRefs } from "pinia";
import { h } from "vue";
import { toast } from "vue-sonner";

export const useWebsocket = () => {
  const planStore = usePlanStore();
  const { paginatedResponse, plan } = storeToRefs(planStore);

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

    await channel.subscribe("planning", (message: Notification<any>) => {
      handlePlanningEvent(message);
    });
  }

  function handlePlanningEvent(message: Notification<any>) {
    switch (message.data.type) {
      case "plan create":
        planStore.getPlans().then((value) => {
          if (value) paginatedResponse.value = value;

          if (message.data.status) notifyPlanCreate(message);
          else notifyPlanCreateFailed(message);
        });

        break;
      case "batch create":
        notifyBatchCreate(message);
        break;

      case "task create":
        notifyTaskCreate(message);
      default:
        break;
    }
  }

  function notifyPlanCreate(message: Notification<Plan>) {
    toast.info("Plan notice", {
      description: message.data.message,
    });
  }

  function notifyPlanCreateFailed(message: Notification<Plan>) {
    toast.error("Plan failed notice", {
      description: message.data.message,
    });
  }

  function notifyBatchCreate(message: Notification<Plan>) {
    if (message.data.data)
      planStore
        .getPlan(message.data.data?.id, { includes: "batches" })
        .then((value) => {
          plan.value = value;
        });

    toast.info("Batch notice", {
      description: message.data.message,
    });
  }

  function notifyTaskCreate(message: Notification<PlanBatch>) {
    if (message.data.data)
      planStore.getBatch(message.data.data?.plan_id, message.data.data.id, {
        includes: "tasks,routes",
      });

    toast.info("Task notice", {
      description: message.data.message,
    });
  }

  return {
    init,
  };
};
