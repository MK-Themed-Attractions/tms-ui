<script setup lang="ts">
import { ImageApp } from "@/components/app/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { msTeamLink } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useWorkerStore } from "@/stores/workerStore";
import { storeToRefs } from "pinia";
import TopWorkersChart from "./dashboard-components/TopWorkersChart.vue";

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const workerStore = useWorkerStore()
const { workers } = storeToRefs(workerStore)

const { fetchWorkers } = useWorker()
function useWorker() {
  async function fetchWorkers() {
    await workerStore.getWorkers({
      includes: 'department',
      appends: ['points', 'run_time']
    })
  }

  return {
    fetchWorkers
  }
}

if (!workers.value) {
  await fetchWorkers()
}
</script>
<template>
  <div class="flex items-center">
    <h1 class="text-lg font-semibold md:text-2xl">MKTA Task management system</h1>
  </div>
  <div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" v-if="!user">
    <div class="flex flex-col items-center gap-1 text-center">
      <ImageApp image="/MKLogo-White.svg" class="invert size-[8rem]" />
      <h3 class="text-2xl font-bold tracking-tight">Login Required</h3>
      <p class="text-sm text-muted-foreground max-w-[40ch]">
        Start using TMS by logging in. Don&apos;t have an account? Contact the <a class="font-medium"
          :href="msTeamLink()">Dev team</a>.
      </p>
      <Separator label="OR" class="mt-2" />
      <Button class="mt-4" as-child>
        <RouterLink :to="{ name: 'login' }">
          Login
        </RouterLink>
      </Button>
    </div>
  </div>
  <div v-else>
    <TopWorkersChart v-if="workers" :workers="workers" class="max-w-[40rem]"/>
  </div>

</template>

<style scoped></style>
