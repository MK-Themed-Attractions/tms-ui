<script setup lang="ts">
import { useWipStore } from "@/stores/wipStore";
import Toolbar from "./components/Toolbar.vue";
import { storeToRefs } from "pinia";
import type { WipTaskQueryParams } from "@/types/wip";

import { formatReadableDate } from "@/lib/utils";

const { fetchWipTasks, wipLoading, wipTasksGrouped } = useWip();

function useWip() {
  const wipStore = useWipStore();
  const { wipTasksGrouped, loading: wipLoading } = storeToRefs(wipStore);

  async function fetchWipTasks(params?: Partial<WipTaskQueryParams>) {
    await wipStore.getTasksByWorkCenters(params);
  }

  return {
    wipTasksGrouped,
    fetchWipTasks,
    wipLoading,
  };
}

async function handleDepartmentSelectionChange(workCenters: string[]) {
  await fetchWipTasks({
    work_centers: workCenters,
  });
}
</script>
<template>
  <div class="container space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Work in progress</h1>
      <p class="text-muted-foreground">
        This section lets you assign workers to tasks, start, pause, and
        complete them, and view real-time task status.
      </p>
    </div>

    <section>
      <Toolbar
        @change="handleDepartmentSelectionChange"
        :loading="wipLoading"
      />
    </section>

    <section>
      <div class="space-y-10">
        <div
          v-for="(product, parentCode) in wipTasksGrouped"
          :key="parentCode"
          class="border bg-blue-50 p-4"
        >
          PARENT SKU: {{ parentCode }}
          <div
            v-for="(plan, sku) in product"
            :key="sku"
            class="border bg-blue-100 p-4"
          >
            SKU: {{ sku }}
            <div
              v-for="(batch, planId) in plan"
              :key="planId"
              class="border bg-blue-200 p-4"
            >
              PLAN ID: {{ planId }}
              <div
                v-for="(tasks, batchId) in batch"
                :key="batchId"
                class="flex flex-wrap gap-2 border bg-blue-300 p-4"
              >
                <span class="basis-full"> BATCH ID: {{ batchId }}</span>

                <div
                  v-for="task in tasks"
                  :key="task.id"
                  class="grid border bg-blue-400 p-4"
                >
                  <span>index: {{ task.task_index }}</span>
                  <span
                    >access date:
                    {{ formatReadableDate(task.can_accessed_at) }}</span
                  >
                  <span>can start?: {{ task.is_startable }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
