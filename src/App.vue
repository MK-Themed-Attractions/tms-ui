<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Toaster } from "./components/ui/sonner";
import { useAuthStore } from "./stores/authStore";
import { watch } from "vue";
import { useWebsocket } from "./composables/useWebsocket";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

/* initialize websocket for user notifications */
watch(
  user,
  async () => {
    await useWebsocket().init();
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <Toaster :duration="5000"></Toaster>
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
