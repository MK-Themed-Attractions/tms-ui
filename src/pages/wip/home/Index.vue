<script setup lang="ts">
import { useWipStore } from "@/stores/wipStore";
import Toolbar from "./components/Toolbar.vue";
import { storeToRefs } from "pinia";
import type { WipBatch, WipPlanQueryParams, WipTask } from "@/types/wip";

import { formatReadableDate, getIconByPlanStatus, getS3Link, toOrdinal } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Ellipsis,
} from "lucide-vue-next";

import CardInfo from "./components/CardInfo.vue";
import WipTaskDataTable from "./components/WipTaskDataTable.vue";
import WipBatchAccordion from "./components/WipBatchAccordion.vue";
import WipTaskDropdown from "./components/WipTaskDropdown.vue";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { provide, ref } from "vue";
import WorkerAssignDialog from "./components/WorkerAssignDialog.vue";
import { TableCell } from "@/components/ui/table";
import { batchWipSuccessKey } from "@/lib/injectionKeys";
import WipTaskShowDialog from "./components/WipTaskShowDialog.vue";

const { fetchWipPlans, wipLoading, wipTasksGrouped, handleGetBatchWip, assigningBatch, selectedTaskIds, handleMultipleTaskAssign, handleSingleTaskAssign, fetchBatchWip } = useWip();
const { openAssignWorkerDialog } = useWorker()
const { handleShowWipDialog, showWipDialog, selectedWip } = useWipShow()
function useWip() {
  const wipStore = useWipStore();
  const { wipTasksGrouped, loading: wipLoading } = storeToRefs(wipStore);
  const assigningBatch = ref<{ batch: WipBatch, taskIds: string[] }>()
  const selectedTaskIds = ref<string[]>([])


  async function fetchWipPlans(params?: Partial<WipPlanQueryParams>) {
    await wipStore.getWipPlansByWorkCenters(params);
  }

  async function fetchBatchWip(batch: WipBatch) {
    const res = await wipStore.getTasksByBatchId(batch.batch_id)

    if (res) {
      batch.tasks = res;
    }
  }

  //fetch batch wips only when batch doesnt have tasks in it
  async function handleGetBatchWip(batch: WipBatch) {
    //only fetch the data when theres no tasks on batch to avoid repeated fetch
    if (batch.tasks) return;
    await fetchBatchWip(batch)
  }

  /**
   * transform tasks array object to task id array
   * @param tasks tasks array to be converted to array of ids
   * @return Array of task ids
   */
  function toTaskIds(tasks: WipTask[]) {
    return tasks.reduce<string[]>((acc, cur) => {
      acc.push(cur.id)
      return acc;
    }, [])
  }

  /**
   * For single task assignment. Sets assigning task and select one task for selectedTaskIds
   * @param task 
   * @param tasks 
   */
  function handleSingleTaskAssign(task: WipTask, batch: WipBatch) {
    const taskIds = toTaskIds(batch.tasks ? batch.tasks : [])

    assigningBatch.value = {
      batch,
      taskIds
    }

    //clear selected task ids to make sure that one id is selected 
    selectedTaskIds.value = []
    selectedTaskIds.value.push(task.id)

    //open the dialog
    openAssignWorkerDialog.value = true
  }

  /**
   * For multiple task assignment. Sets assigning task and select all task for selectedTaskIds
   * @param tasks 
   */
  function handleMultipleTaskAssign(batch: WipBatch) {
    const taskIds = toTaskIds(batch.tasks ? batch.tasks : [])

    assigningBatch.value = {
      batch,
      taskIds
    }

    //make selected tasks ids to be the assigning task ids
    //this simply means select all of the assigning task ids
    selectedTaskIds.value = JSON.parse(JSON.stringify(assigningBatch.value.taskIds));

    openAssignWorkerDialog.value = true
  }

  return {
    wipTasksGrouped,
    fetchWipPlans,
    fetchBatchWip,
    wipLoading,
    handleGetBatchWip,
    assigningBatch,
    selectedTaskIds,
    handleSingleTaskAssign,
    handleMultipleTaskAssign
  };
}

function useWorker() {
  const openAssignWorkerDialog = ref(false)

  return {
    openAssignWorkerDialog
  }
}

function useWipShow() {
  const showWipDialog = ref(false)
  const selectedWip = ref<WipTask>()

  function handleShowWipDialog(task: WipTask) {
    selectedWip.value = task;
    showWipDialog.value = true;
  }

  return {
    showWipDialog,
    handleShowWipDialog,
    selectedWip
  }
}

async function handleDepartmentSelectionChange(workCenters: string[]) {
  await fetchWipPlans({
    work_centers: workCenters,
  });
}


/* Provide the batch fetching functionality on children components */
provide(batchWipSuccessKey, fetchBatchWip)

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

                <WipBatchAccordion type="multiple" :wip-batch="plan.batch_data" @select="handleGetBatchWip">
                  <template #default="{ batch }">
                    <WipTaskDataTable v-if="batch.tasks && batch.tasks.length" :tasks="batch.tasks"
                      @select="handleShowWipDialog">
                      <template #action.header>
                        <TableCell>
                          <WipTaskDropdown>
                            <template #activator>
                              <Ellipsis class="size-4" />
                            </template>

                            <DropdownMenuLabel>Batch</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="handleMultipleTaskAssign(batch)">Assign multiple tasks
                            </DropdownMenuItem>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Start all</DropdownMenuItem>
                            <DropdownMenuItem>Pause all</DropdownMenuItem>
                            <DropdownMenuItem>Stop all</DropdownMenuItem>
                            <DropdownMenuItem>Finish all</DropdownMenuItem>
                          </WipTaskDropdown>
                        </TableCell>
                      </template>
                      <template #action="{ task }">
                        <WipTaskDropdown>
                          <template #activator>
                            <Ellipsis class="invisible group-hover:visible size-4 m-auto" />
                          </template>
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem @click.stop="handleSingleTaskAssign(task, batch)">Assign task
                          </DropdownMenuItem>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem>Start</DropdownMenuItem>
                          <DropdownMenuItem>Pause</DropdownMenuItem>
                          <DropdownMenuItem>Stop</DropdownMenuItem>
                          <DropdownMenuItem>Finish</DropdownMenuItem>
                        </WipTaskDropdown>

                      </template>
                    </WipTaskDataTable>
                  </template>
                </WipBatchAccordion>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DIALOGS -->
      <WorkerAssignDialog v-model:selected-task-ids="selectedTaskIds" v-model="openAssignWorkerDialog"
        v-if="assigningBatch" :batch="assigningBatch">
      </WorkerAssignDialog>

      <WipTaskShowDialog v-if="selectedWip" v-model="showWipDialog" :task="selectedWip"></WipTaskShowDialog>
    </section>
  </div>
</template>

<style scoped></style>
