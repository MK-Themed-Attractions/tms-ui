<script setup lang="ts">
import { useWipStore } from "@/stores/wipStore";
import Toolbar from "./components/Toolbar.vue";
import { storeToRefs } from "pinia";
import type { WipBatch, WipPlanQueryParams } from "@/types/wip";

import { formatReadableDate, getIconByPlanStatus, getS3Link, toOrdinal } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {

  LoaderCircle,

} from "lucide-vue-next";

import CardInfo from "./components/CardInfo.vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import WipTaskDataTable from "./components/WipTaskDataTable.vue";
import WipBatchAccordion from "./components/WipBatchAccordion.vue";

const { fetchWipPlans, wipLoading, wipTasksGrouped, handleGetWip } = useWip();

function useWip() {
  const wipStore = useWipStore();
  const { wipTasksGrouped, loading: wipLoading } = storeToRefs(wipStore);

  async function fetchWipPlans(params?: Partial<WipPlanQueryParams>) {
    await wipStore.getWipPlansByWorkCenters(params);
  }

  async function handleGetWip(batch: WipBatch) {

    //only fetch the data when theres no tasks on batch to avoid repeated fetch
    if (batch.tasks) return;

    const res = await wipStore.getTasksByBatchId(batch.batch_id)

    if (res) {
      batch.tasks = res;
    }
  }

  return {
    wipTasksGrouped,
    fetchWipPlans,
    wipLoading,
    handleGetWip
  };
}

async function handleDepartmentSelectionChange(workCenters: string[]) {
  await fetchWipPlans({
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
        <div v-for="parentProduct in wipTasksGrouped" :key="parentProduct.sku"
          class="rounded-md border p-4 shadow-sm space-y-4">
          <div v-for="product in parentProduct.product_data" :key="product.sku" class="space-y-4">
            <div class="flex gap-2 items-start">
              <CardInfo :image="getS3Link(parentProduct.thumbnail, 'thumbnail')" label="Based on product SKU">
                {{
                  parentProduct.sku }}</CardInfo>

            </div>
            <div class="flex flex-wrap gap-4">
              <div v-for="plan in product.plan_data" :key="plan.id"
                class="border rounded-md p-4 space-y-2 basis-[30rem] flex-1">
                <div class="flex gap-4">
                  <CardInfo :image="getS3Link(product.thumbnail, 'thumbnail')" label="Product SKU">{{ product.sku }}
                  </CardInfo>
                  <CardInfo label="Plan code">{{ plan.code }}</CardInfo>
                  <div class="ml-auto flex flex-col justify-center gap-2">
                    <Badge class="ml-auto capitalize gap-1">
                      <component :is="getIconByPlanStatus(plan.status_code)" class="size-4" />
                      {{ plan.status_code }}
                    </Badge>
                    <p class="text-xs text-muted-foreground">{{ formatReadableDate(plan.created_at) }}</p>
                  </div>
                </div>

                <Separator />

                <WipBatchAccordion type="multiple" :wip-batch="plan.batch_data" @select="handleGetWip" />

              </div>
            </div>
          </div>

        </div>
        <!-- <template v-for="(parent, parentCode) in wipTasksGrouped" :key="parentCode">
          <template v-for="(plan, sku) in parent" :key="sku">
            <div v-for="(batches, planId) in plan" :key="planId"
              class="grid xl:grid-cols-2 border rounded-md p-4 shadow-sm gap-4">
              <div v-for="(tasks, batchId) in batches" :key="batchId" class="border rounded-md">
                <div class="flex flex-wrap items-center gap-4 p-4 grow">

                  <div class="flex items-center gap-4">
                    <div class="size-16 bg-muted rounded-md ">
                      <ImageApp :image="getS3Link(tasks[0].parent_thumbnail, 'thumbnail')"
                        class="max-w-full max-h-full" />
                    </div>
                    <div>
                      <p class="font-medium">{{ tasks[0].parent_code }}</p>
                      <span class="text-sm text-muted-foreground">Parent product SKU</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="size-16 bg-muted rounded-md">
                      <ImageApp :image="getS3Link(tasks[0].product.thumbnail, 'thumbnail')"
                        class="max-w-full max-h-full" />
                    </div>
                    <div>
                      <p class="font-medium">{{ tasks[0].product.sku }}</p>
                      <span class="text-sm text-muted-foreground">Product SKU</span>
                    </div>

                  </div>

                  <div>
                    <p class="font-medium">{{ tasks[0].plan.code }}</p>
                    <span class="text-sm text-muted-foreground">Plan code</span>
                  </div>


                </div>
                <div class="flex justify-between p-4 pt-0 text-sm items-end">
                  <div class="font-medium">
                    {{ toOrdinal(tasks[0].batch.batch_index + 1) }} Batch
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <Badge variant="secondary">
                      {{ tasks.length }} Tasks</Badge>
                    <span class="text-muted-foreground">Scheduled on {{ formatReadableDate(tasks[0].batch.start_date)
                    }}</span>
                  </div>

                </div>
                <Separator label="TASKS" class="mb-2" />

                <Table>
                  <TableHeader>
                    <TableRow class="border-none">
                      <TableHead class="h-8">Status</TableHead>
                      <TableHead class="h-8">Access date</TableHead>
                      <TableHead class="h-8">Availability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="task in tasks" :key="task.id" class="border-none group">
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
          </template>
</template> -->
      </div>
    </section>
  </div>
</template>

<style scoped></style>
