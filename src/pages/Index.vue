<script setup lang="ts">
import { ImageApp } from "@/components/app/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { msTeamLink } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useWorkerStore } from "@/stores/workerStore";
import { storeToRefs } from "pinia";
import TopWorkersChart from "./dashboard-components/TopWorkersChart.vue";
import { computed } from "vue";
import { BarChart } from "@/components/ui/chart-bar";
import { Card } from "@/components/ui/card";
import { HardHat, ThumbsDown, Wrench, Zap } from "lucide-vue-next";

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const workerStore = useWorkerStore()
const { workers } = storeToRefs(workerStore)

const { fetchWorkers, topWorkersByPoints, topWorkersByRunTime } = useWorker()
function useWorker() {
  async function fetchWorkers() {
    await workerStore.getWorkers({
      includes: 'department',
      appends: ['points', 'run_time']
    })
  }

  const topWorkersByPoints = computed(() => {
    if (!workers.value) return;
    return [...workers.value].map(worker => {
      return {
        id: worker.id,
        value: worker.full_name,
        points: worker.points?.current_year
      }
    })
  })

  const topWorkersByRunTime = computed(() => {
    if (!workers.value) return;
    return [...workers.value].map(worker => {
      return {
        id: worker.id,
        value: worker.full_name,
        points: worker.run_time?.current_month
      }
    })
  })

  return {
    fetchWorkers,
    topWorkersByPoints,
    topWorkersByRunTime
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
  <div v-else class="grid gap-6">
    <div class="grid xl:grid-cols-4 lg:grid-cols-2  gap-6">
      <Card class="p-4 flex flex-col ">
        <div class="flex justify-between">
          <p class="font-medium">Completed Tasks</p>
          <Wrench class="size-4" />
        </div>
        <div>
          <span class="text-7xl font-bold leading-[1.2]">499</span>
          <p class="text-xs text-muted-foreground">+24% higher from yesterday</p>
        </div>
      </Card>
      <Card class="p-4 flex flex-col ">
        <div class="flex justify-between">
          <p class="font-medium">Failed Tasks</p>
          <ThumbsDown class="size-4" />
        </div>
        <div>
          <span class="text-7xl font-bold leading-[1.2]">3</span>
          <p class="text-xs text-muted-foreground">
            +33.4% lower from yesterday
          </p>
        </div>
      </Card>
      <Card class="p-4 flex flex-col ">
        <div class="flex justify-between">
          <p class="font-medium">Top Performer</p>
          <HardHat class="size-4" />
        </div>
        <div>
          <span class="text-7xl font-bold leading-[1.2]">1,245</span> <span class="text-sm">pts.</span>
          <p class="text-xs text-muted-foreground">Got by <strong>Roy Victor</strong> from <strong>Casting</strong>
            department.
          </p>
        </div>
      </Card>
      <Card class="p-4 flex flex-col ">
        <div class="flex justify-between">
          <p class="font-medium">Efficient Employee</p>
          <Zap class="size-4" />
        </div>
        <div>
          <span class="text-7xl font-bold leading-[1.2]">125</span> <span class="text-sm">mins/per task.</span>
          <p class="text-xs text-muted-foreground">
            Performed by <strong>John Ricky</strong> from <strong>Sanding</strong> department.
          </p>
        </div>
      </Card>
    </div>

    <div class="grid xl:grid-cols-2 gap-6 items-start">
      <TopWorkersChart v-if="topWorkersByPoints" :items="topWorkersByPoints" :display-count="5" category="points"
        name="value" class="basis-[40rem]" title="Top performing employees" />
      <TopWorkersChart v-if="topWorkersByRunTime" :items="topWorkersByRunTime" :display-count="5" category="points"
        order="asc" name="value" class="basis-[40rem]" title="Top Efficient employees" />
    </div>



  </div>

</template>

<style scoped></style>
