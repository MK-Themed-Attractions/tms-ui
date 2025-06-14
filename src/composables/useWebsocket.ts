import { useAuthStore } from "@/stores/authStore";
import { usePlanStore } from "@/stores/planStore";
import { useToastUIStore } from "@/stores/ui/toastUIStore";
import type { Notification } from "@/types/notification";
import type { Plan, PlanBatch } from "@/types/planning";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";

export const useWebsocket = () => {
  const route = useRoute();
  const planStore = usePlanStore();
  const { paginatedResponse, plan } = storeToRefs(planStore);
  const toastStore = useToastUIStore();

  async function init() {
    const authStore = useAuthStore();
    const { user } = storeToRefs(authStore);

    if (!user.value) {
      console.warn("No user found, skipping websocket initialization");
      return;
    }

    // Connect to Ably with your API key
    // @ts-ignore
    const realtime = new Ably.Realtime.Promise(
      import.meta.env.VITE_ABLY_PUBLIC_KEY,
    );

    // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
    const channel = realtime.channels.get(`notifications.${user.value.id}`);

    await channel.subscribe("planning", (message: Notification<any>) => {
      handlePlanningEvent(message);
    });

    const workCenterChannel = realtime.channels.get(`notifications.DET`);

    await workCenterChannel.subscribe(
      "common",
      (message: Notification<any>) => {
        console.log(message);
      },
    );
  }

  function handlePlanningEvent(message: Notification<any>) {
    switch (message.data.type) {
      case "plan create":
        notifyPlanCreate(message);
        break;
      case "batch create":
        notifyBatchCreate(message);
        break;
      case "task create":
        notifyTaskCreate(message);
      case "plan delete": {
        toastStore.dismissLastAddedToast();
        notifyPlanCreate(message);
        break;
      }
      default:
        break;
    }
  }

  function notifyPlanCreate(message: Notification<Plan>) {
    if (route.name === "planningShow" && message.data.status) {
      if (message.data.data)
        planStore.getPlan(message.data.data.id, {includes: 'batches'}).then(() => showToast());
    } else {
      planStore.getPlans().then(() => showToast());
    }

    function showToast() {
      if (message.data.status) {
        toast.info("Plan notice", {
          description: message.data.message,
        });
      } else notifyPlanCreateFailed(message);
    }
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
