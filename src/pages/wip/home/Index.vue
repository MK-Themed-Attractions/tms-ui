<script setup lang="ts">
import { useWipStore } from "@/stores/wipStore";
import Toolbar from "./components/Toolbar.vue";
import { storeToRefs } from "pinia";
import type { TaskStatus, WipBatch, WipPlanQueryParams, WipTask, WipTaskQueryParams } from "@/types/wip";

import { formatReadableDate, getIconByPlanStatus, getS3Link, toOrdinal } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Building,
  Ellipsis,
  Wrench,
} from "lucide-vue-next";

import CardInfo from "./components/CardInfo.vue";
import WipTaskDataTable from "./components/WipTaskDataTable.vue";
import WipBatchAccordion from "./components/WipBatchAccordion.vue";
import WipTaskDropdown from "./components/WipTaskDropdown.vue";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { onBeforeMount, onBeforeUnmount, provide, ref, watch, watchEffect } from "vue";
import WorkerAssignDialog from "./components/WorkerAssignDialog.vue";
import { TableCell } from "@/components/ui/table";
import { batchWipSuccessKey } from "@/lib/injectionKeys";
import WipTaskShowDialog from "./components/WipTaskShowDialog.vue";
import { useTaskControls } from "../../../composables/useTaskControls";
import { ButtonApp } from "@/components/app/button";
import { ConfirmationDialog } from "@/components/app/confirmation-dialog";
import { toast } from "vue-sonner";
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import { InputFilter, type InputFilterDropdownData, type InputFilterSearchData } from "@/components/app/input-filter";
import { searchFilterData } from "../data";
import WIPFilter from "./components/WIPFilter.vue";

const { fetchWipPlans,
  wipLoading,
  wipTasksGrouped,
  handleGetBatchWip,
  assigningBatch,
  selectedTaskIds,
  handleSingleTaskAssign,
  fetchBatchWip,
  handleShowMultipleTaskAssignDialog,
  selectedTaskPlanId,
  handleShowSingleTaskAssignDialog } = useWip();

const { openAssignWorkerDialog, selectedDepartmentId } = useWorker()
const { handleShowWipDialog, showWipDialog } = useWipShow()
const { canAssign, canFinish, canPause, canStart, hasWorkers, isNotDone, finishTask, showWipToast, startTask, pauseTask } = useTaskControls()
const { handleFinishTask,
  handlePauseTask,
  handleStartTask,
  showBatchOperationDialog,
  showBatchWorkerRemoveDialog,
  handleConfirmFinishAll,
  handleConfirmPauseAll,
  handleConfirmStartAll,
  handleShowBatchWorkerRemoveDialog,
  batchOperationData,
  selectedOperation,
  changeTasksStatus,
  removeTasksWorkers } = useTaskOperations()
const workerDepartmentStore = useWorkerDepartmentStore()
const { selectedTaskStatusFilter, handleGetWIpsWithFilter, filter, search } = useTaskStatusFilter()

function useWip() {
  const wipStore = useWipStore();
  const { wipTasksGrouped, loading: wipLoading } = storeToRefs(wipStore);
  const assigningBatch = ref<{ batch: WipBatch, taskIds: string[] }>()

  //task ids on common ms
  const selectedTaskIds = ref<string[]>([])

  //id on planning ms
  const selectedTaskPlanId = ref<string>()


  async function fetchWipPlans(params?: Partial<WipPlanQueryParams>) {
    await wipStore.getWipPlansByWorkCenters(params);
  }

  async function fetchBatchWip(batch: WipBatch) {
    const workCenters = workerDepartmentStore.getWorkCentersByDeptId(selectedDepartmentId.value || '')

    const params: Partial<WipTaskQueryParams> = { operation_code: workCenters }
    if (selectedTaskStatusFilter.value)
      params.filter = selectedTaskStatusFilter.value;
    const res = await wipStore.getTasksByBatchId(batch.batch_id, params)

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

    selectedTaskPlanId.value = task.task_plan_id
  }

  /**
   * For multiple task assignment. Sets assigning task and select all task for selectedTaskIds
   * @param tasks 
   */
  function handleMultipleTaskAssign(batch: WipBatch) {
    const tasks = batch.tasks?.filter(task => canAssign(task.status))
    const taskIds = toTaskIds(tasks ? tasks : [])

    assigningBatch.value = {
      batch,
      taskIds
    }

    //make selected tasks ids to be the assigning task ids
    //this simply means select all of the assigning task ids
    selectedTaskIds.value = JSON.parse(JSON.stringify(assigningBatch.value.taskIds));
  }

  function handleShowSingleTaskAssignDialog(task: WipTask, batch: WipBatch) {
    handleSingleTaskAssign(task, batch)
    //open the dialog
    openAssignWorkerDialog.value = true
  }

  function handleShowMultipleTaskAssignDialog(batch: WipBatch) {

    handleMultipleTaskAssign(batch)
    //open the dialog
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
    selectedTaskPlanId,
    handleSingleTaskAssign,
    handleMultipleTaskAssign,
    handleShowSingleTaskAssignDialog,
    handleShowMultipleTaskAssignDialog
  };
}

function useWorker() {
  const openAssignWorkerDialog = ref(false)
  const selectedDepartmentId = ref<string>()

  return {
    openAssignWorkerDialog,
    selectedDepartmentId
  }
}

function useWipShow() {

  const showWipDialog = ref(false)

  function handleShowWipDialog(task: WipTask, batch: WipBatch) {
    handleSingleTaskAssign(task, batch)

    showWipDialog.value = true;
  }

  return {
    showWipDialog,
    handleShowWipDialog,
  }
}

function useTaskOperations() {

  const wipStore = useWipStore()
  const { errors: wipErrors } = storeToRefs(wipStore)

  const showBatchOperationDialog = ref(false)
  const showBatchWorkerRemoveDialog = ref(false)
  const batchOperationData = {
    start: {
      message: 'All tasks with the statuses PENDING, QC FAILED, and PAUSED will be started. Are you sure you want to proceed?',
      status: 'start'
    },
    pause: {
      message: 'All tasks with the status ONGOING will be paused. Are you sure you want to proceed?',
      status: 'pause'
    },
    done: {
      message: 'All tasks with the status ONGOING will be finished. Are you sure you want to proceed?',
      status: 'done'
    }
  }
  const selectedOperation = ref<keyof typeof batchOperationData>()
  const selectedBatch = ref<WipBatch>()

  async function handleFinishTask(task: WipTask, batch: WipBatch) {
    //mutate the task
    const success = await finishTask(task)
    //fetch the batch for updated values
    fetchBatchWip(batch)
    //show toast
    showWipToast(success);
  }
  async function handleStartTask(task: WipTask, batch: WipBatch) {
    //mutate the task
    const success = await startTask(task)
    //fetch the batch for updated values
    fetchBatchWip(batch)
    //show toast
    showWipToast(success);
  }
  async function handlePauseTask(task: WipTask, batch: WipBatch) {
    //mutate the task
    const success = await pauseTask(task)
    //fetch the batch for updated values
    fetchBatchWip(batch)
    //show toast
    showWipToast(success);
  }

  /**
   * get the correct validation based on selected operation
   */
  function getTaskValidationByOperation() {
    switch (selectedOperation.value) {
      case 'start':
        return canStart;
      case 'done':
        return canFinish;
      case 'pause':
        return canPause;
    }
  }

  /**
   * Use to change the status of all batch's tasks at once
   */
  async function changeTasksStatus() {
    if (!selectedOperation.value || !selectedBatch.value?.tasks) return;

    const can = getTaskValidationByOperation()

    //first we filter the tasks that are needed based on the selected operation 
    //it will call the right function. then we convert those filtered tasks
    //into an array of task id
    const taskIds = selectedBatch.value.tasks.filter(task => can!(task.status)).reduce<string[]>((acc, task) => {
      acc.push(task.id)
      return acc;
    }, [])

    //when theres no valid tasks that met the criteria or the validations
    //return from this function
    if (!taskIds.length) {
      toast.warning('Batch Info', {
        description: 'No tasks are affected by this operation.'
      })
      return;
    }

    await wipStore.changeTaskStatusArray({
      status: selectedOperation.value,
      tasks: taskIds
    })

    if (!wipErrors.value) {
      toast.info('Batch Info', {
        description: 'Operation successful.'
      })
      await fetchBatchWip(selectedBatch.value)
    } else {
      toast.error('Batch Info', {
        description: 'Operation Failed'
      })
    }
  }

  async function removeTasksWorkers() {
    if (!selectedBatch.value || !selectedBatch.value.tasks) return;

    const taskIds = selectedBatch.value.tasks.reduce<string[]>((acc, task) => {
      if (!canAssign(task.status)) return acc;

      acc.push(task.id)

      return acc;
    }, [])

    //collect all worker ids on each task
    const workerIds = selectedBatch.value.tasks.reduce<string[]>((acc, task) => {
      if (!task.task_workers || !task.task_workers.worker_ids) return acc;

      //worker ids
      const wIds = task.task_workers.worker_ids.reduce<string[]>((workerAcc, workerId) => {
        workerAcc.push(workerId)
        return workerAcc;
      }, [])

      acc.push(...wIds);
      return acc;
    }, [])

    //do not proceed when theres at least one workers on each task
    if (!workerIds.length) {
      toast.warning('Batch Info', {
        description: 'No tasks are affected by this operation.'
      })
      return;
    }

    //get only the unique ids
    const uniqueWorkerIds = [... new Set(workerIds)];


    toast.info('Processing, please wait',
      { description: 'This may take some times, do not interupt the process' }
    )
    await wipStore.unassignWorkersFromTasks({
      tasks: taskIds,
      workers: uniqueWorkerIds
    })

    if (!wipErrors.value) {
      toast.info('Batch Info', {
        description: 'All workers from each task has been removed.'
      })
      await fetchBatchWip(selectedBatch.value)

    } else {
      toast.error('Batch Info', {
        description: 'Something went wrong while removing all workers from each task.'
      })
    }
  }

  function handleConfirmStartAll(batch: WipBatch) {
    selectedBatch.value = batch;
    selectedOperation.value = 'start';
    showBatchOperationDialog.value = true;
  }

  function handleConfirmPauseAll(batch: WipBatch) {

    selectedBatch.value = batch;
    selectedOperation.value = 'pause';
    showBatchOperationDialog.value = true;
  }

  function handleConfirmFinishAll(batch: WipBatch) {
    selectedBatch.value = batch;
    selectedOperation.value = 'done';
    showBatchOperationDialog.value = true;
  }

  function handleShowBatchWorkerRemoveDialog(batch: WipBatch) {
    selectedBatch.value = batch;
    showBatchWorkerRemoveDialog.value = true;
  }

  return {
    handleFinishTask,
    handleStartTask,
    handlePauseTask,
    showBatchOperationDialog,
    showBatchWorkerRemoveDialog,
    handleShowBatchWorkerRemoveDialog,
    selectedOperation,
    handleConfirmFinishAll,
    handleConfirmPauseAll,
    handleConfirmStartAll,
    batchOperationData,
    changeTasksStatus,
    removeTasksWorkers
  }
}

function useTaskStatusFilter() {
  const selectedTaskStatusFilter = ref<TaskStatus>()
  const search = ref('')
  const filter = ref<InputFilterDropdownData>(searchFilterData[0])

  async function handleGetWIpsWithFilter() {
    const workCenters = workerDepartmentStore.getWorkCentersByDeptId(selectedDepartmentId.value || '')

    /* if search keyword is empty refetch plans */
    if (!search.value.trim()) {
      await fetchWipPlans({
        work_centers: workCenters,
        filter: selectedTaskStatusFilter.value,
      })
      return;
    }

    /* refetch plans with applied filters */
    await fetchWipPlans({
      work_centers: workCenters,
      filterBy: filter.value?.key,
      keyword: search.value,
    })


  }

  watch(selectedTaskStatusFilter, async (newValue) => {
    await handleGetWIpsWithFilter()
  })

  return {
    selectedTaskStatusFilter,
    handleGetWIpsWithFilter,
    search,
    filter
  }
}
function isBatchDone(batch: WipBatch) {
  if (!batch.tasks) return false;
  return batch.tasks.every(task => task.status === 'done');
}
function isBatchStartable(batch: WipBatch) {
  if (!batch.tasks) return false
  return batch.tasks.some(task => task.is_startable);
}
function isBatchAssignable(batch: WipBatch) {
  if (!batch.tasks) return false;
  return batch.tasks.some(task => canAssign(task.status))
}

async function handleDepartmentSelectionChange(workCenters: string[]) {
  /* reset the filter */
  selectedTaskStatusFilter.value = undefined;
  await fetchWipPlans({
    work_centers: workCenters,
  });
}

/* Provide the batch fetching functionality on children components */
provide(batchWipSuccessKey, fetchBatchWip)

/* CLEANUP */
// clear the wip task grouped when this component unmounted
onBeforeUnmount(() => {
  useWipStore().reset()
})
onBeforeMount(() => {
  useWipStore().reset()
})

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
      <Toolbar v-model="selectedDepartmentId" @change="handleDepartmentSelectionChange" :loading="wipLoading">
        <template #append>
          <InputFilter v-model:search="search" v-model:filter="filter" :dropdown-data="searchFilterData"
            :disabled="!selectedDepartmentId" @submit="handleGetWIpsWithFilter">
          </InputFilter>

          <div class="basis-full">
            <WIPFilter v-model="selectedTaskStatusFilter" />
          </div>
        </template>

      </Toolbar>
    </section>

    <section>
      <div class="space-y-10" v-if="wipTasksGrouped && wipTasksGrouped.length" :key="selectedDepartmentId">
        <div v-for="parentProduct in wipTasksGrouped" :key="parentProduct.id"
          class="rounded-md border p-4 shadow-sm space-y-4">
          <div v-for="product in parentProduct.product_data" :key="product.id" class="space-y-4">
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

                <WipBatchAccordion type="multiple" :wip-batch="plan.batch_data" @select="handleGetBatchWip"
                  :loading="wipLoading">
                  <template #default="{ batch }">
                    <WipTaskDataTable v-if="batch.tasks && batch.tasks.length" :tasks="batch.tasks"
                      @select="(task) => handleShowWipDialog(task, batch)">

                      <template #action.header>
                        <TableCell>
                          <WipTaskDropdown v-if="!isBatchDone(batch)">
                            <template #activator>
                              <ButtonApp class="size-6" variant="outline" size="icon">
                                <Ellipsis class="size-4" />
                              </ButtonApp>
                            </template>

                            <template v-if="isBatchAssignable(batch)">
                              <DropdownMenuLabel>Batch</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem @click="handleShowMultipleTaskAssignDialog(batch)">Assign multiple tasks
                              </DropdownMenuItem>
                              <DropdownMenuItem @click="handleShowBatchWorkerRemoveDialog(batch)">Remove all workers
                                from tasks
                              </DropdownMenuItem>
                            </template>
                            <template v-if="isBatchStartable(batch)">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem @click="handleConfirmStartAll(batch)">Start all</DropdownMenuItem>
                              <DropdownMenuItem @click="handleConfirmPauseAll(batch)">Pause all</DropdownMenuItem>
                              <DropdownMenuItem @click="handleConfirmFinishAll(batch)">Finish all</DropdownMenuItem>
                            </template>
                          </WipTaskDropdown>
                        </TableCell>
                      </template>

                      <template #action="{ task }">
                        <WipTaskDropdown v-if="isNotDone(task.status)">
                          <template #activator>
                            <Ellipsis class="invisible group-hover:visible size-4 m-auto" />
                          </template>
                          <template v-if="canAssign(task.status)">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click.stop="handleShowSingleTaskAssignDialog(task, batch)">
                              Assign task
                            </DropdownMenuItem>
                          </template>

                          <template v-if="hasWorkers(task.status) && task.is_startable">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem v-if="canStart(task.status)" @click.stop="handleStartTask(task, batch)">
                              Start
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="canPause(task.status)" @click.stop="handlePauseTask(task, batch)">
                              Pause
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="canFinish(task.status)" @click.stop="handleFinishTask(task, batch)">
                              Finish
                            </DropdownMenuItem>

                          </template>
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
      <!-- fallback for no department -->
      <div v-else-if="!wipTasksGrouped"
        class=" border border-dashed rounded-md grid min-h-[40vh] p-4 place-content-center text-center">
        <Building class="mx-auto" />
        <h2 class="text-2xl font-bold tracking-tight">No department selected</h2>
        <p class="text-sm text-muted-foreground">click on the toolbar and select a department to
          start.</p>
      </div>
      <!-- fallback for empty wip -->
      <div v-else class=" border border-dashed rounded-md grid min-h-[40vh] p-4 place-content-center text-center">
        <Wrench class="mx-auto" />
        <h2 class="text-2xl font-bold tracking-tight">No tasks available</h2>
        <p class="text-sm text-muted-foreground">There are no tasks available at the moment. Please check again later.
        </p>
      </div>
    </section>

    <!-- DIALOGS -->
    <WorkerAssignDialog v-model:selected-task-ids="selectedTaskIds" v-model="openAssignWorkerDialog"
      v-if="assigningBatch" :batch="assigningBatch">
    </WorkerAssignDialog>

    <WipTaskShowDialog v-if="selectedTaskPlanId && assigningBatch" v-model="showWipDialog" :batch="assigningBatch.batch"
      :task-id="selectedTaskPlanId">
    </WipTaskShowDialog>

    <!-- confirmation dialog for batch's tasks change status -->
    <ConfirmationDialog v-if="selectedOperation" v-model="showBatchOperationDialog" title="Batch Confirmation"
      @yes="changeTasksStatus" description="Read before proceeding">{{ batchOperationData[selectedOperation].message }}
    </ConfirmationDialog>

    <ConfirmationDialog title="Remove Worker Confirmation" description="Read before proceeding"
      v-model="showBatchWorkerRemoveDialog" @yes="removeTasksWorkers">
      <p>You are about to remove all workers from the tasks. Please note that no points will be given to them once
        removed.
        Do you want to proceed?</p>
    </ConfirmationDialog>
  </div>
</template>

<style scoped></style>