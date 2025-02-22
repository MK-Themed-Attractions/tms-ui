<script setup lang="ts">
import { useWipStore } from "@/stores/wipStore";
import Toolbar from "./components/Toolbar.vue";
import { storeToRefs } from "pinia";
import type { WipTaskQueryParams } from "@/types/wip";

import { formatReadableDate, toOrdinal } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, CircleHelp, Ellipsis, EllipsisVertical, X } from "lucide-vue-next";

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
      <Toolbar @change="handleDepartmentSelectionChange" :loading="wipLoading" />
    </section>

    <section>
      <div class="space-y-10">
        <div v-for="(product, parentCode) in wipTasksGrouped" :key="parentCode" class="border rounded-md p-4 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="size-16 bg-muted rounded-md">
            </div>
            <div>
              <p class="font-medium">{{ parentCode }}</p>
              <span class="text-sm text-muted-foreground">Parent code</span>
            </div>
          </div>
          <div v-for="(plan, sku) in product" :key="sku" class="border rounded-md p-4">
            <div class="flex items-center gap-4 mb-4">
              <div class="size-16 bg-muted rounded-md">
              </div>
              <div>
                <p class="font-medium">{{ sku }}</p>
                <span class="text-sm text-muted-foreground">Product SKU</span>
              </div>
            </div>
            <div v-for="(batches, planId) in plan" :key="planId" class="border rounded-md p-4 flex flex-wrap gap-4">
              <div class="basis-full">
                <p class="font-medium">{{ planId }}</p>
                <span class="text-sm text-muted-foreground">Plan code</span>
              </div>
              <div v-for="(batch, batchId) in batches" :key="batchId" class="border rounded-md">
                <div class="flex justify-between p-4 text-sm  items-center">
                  <div>
                    <p class="font-medium"> {{ toOrdinal(batch.batchIndex + 1) }} Batch</p>
                    <span class="text-muted-foreground">Jan 15, 2024</span>
                  </div>
                  <Badge variant="secondary">
                    5 tasks</Badge>
                </div>
                <Separator />

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead class="h-8">SKU</TableHead>
                      <TableHead class="h-8">Plan code</TableHead>
                      <TableHead class="h-8">Status</TableHead>
                      <TableHead class="h-8">Access date</TableHead>
                      <TableHead class="h-8">Availability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="task in batch.tasks" :key="task.id" class="border-none group">
                      <TableCell>{{ task.sku }}</TableCell>
                      <TableCell>{{ task.plan_id }}</TableCell>

                      <TableCell>
                        <Badge variant="secondary" class="gap-2">
                          <CircleHelp class="size-4" /> {{ task.status }}
                        </Badge>
                      </TableCell>
                      <TableCell class="text-muted-foreground">{{ formatReadableDate(task.can_accessed_at) }}
                      </TableCell>
                      <TableCell class="flex justify-center ">
                        <Check v-if="task.is_startable" class="size-4 " />
                        <X v-else class="size-4" />
                      </TableCell>
                      <TableCell>
                        <Ellipsis class="invisible group-hover:visible size-4" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
