<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Toaster } from "./components/ui/sonner";
import { useAuthStore } from "./stores/authStore";
import type { Notification } from "./types/notification";
import { toast } from "vue-sonner";
import type { Plan } from "./types/planning";

function useWebsocket() {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  // Connect to Ably with your API key
  const realtime = new Ably.Realtime.Promise(
    import.meta.env.VITE_ABLY_PUBLIC_KEY,
  );

  // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
  const channel = realtime.channels.get(`notifications.${user.value.id}`);
  channel.subscribe("planning", (message: Notification<Plan>) => {
    console.log(message);

    toast(message.data.message, {
      description: `Plan with code: ${message.data.data?.plan_data.code} has been created.`,
    });
  });
}

useWebsocket();
</script>

<template>
  <Toaster></Toaster>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense timeout="0">
        <!-- main content -->
        <component :is="Component"></component>

        <!-- loading state -->
        <template #fallback> Loading... </template>
      </Suspense>
    </template>
  </RouterView>
</template>
