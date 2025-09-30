<script setup lang="ts">
import ButtonApp from "@/components/app/button/ButtonApp.vue";
import {
  InfiniteScroll,
  InfiniteScrollTrigger,
} from "@/components/app/infinite-scroll";
import type { InputFilterDropdownData } from "@/components/app/input-filter";
import InputFilter from "@/components/app/input-filter/InputFilter.vue";
import { SectionHeader } from "@/components/app/section-header";
import {
  TaskGroup,
  TaskGroupImage,
  TaskGroupLabel,
} from "@/components/app/task-group";
import { Badge } from "@/components/ui/badge";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuLabel from "@/components/ui/dropdown-menu/DropdownMenuLabel.vue";
import DropdownMenuSeparator from "@/components/ui/dropdown-menu/DropdownMenuSeparator.vue";
import TableCell from "@/components/ui/table/TableCell.vue";
import {
  formatReadableDate,
  getIconByPlanStatus,
} from "@/lib/utils";
import { searchFilterData, type SelectedDateRange } from "@/pages/wip/data";
import Toolbar from "@/pages/wip/home/components/Toolbar.vue";
import WipBatchAccordion from "@/pages/wip/home/components/WipBatchAccordion.vue";
import WipTaskDropdown from "@/pages/wip/home/components/WipTaskDropdown.vue";
import { useWipStore } from "@/stores/wipStore";
import type {
  WipBatch,
  WipPlan,
  WipPlanQueryParams,
  WipTask,
  WipTaskGrouped,
  WipTaskQueryParams,
} from "@/types/wip";
import type { WorkerDepartment } from "@/types/workers";
import {
  ArrowRight,
  Building,
  Ellipsis,
  Eye,
  Layers,
  Pencil,
  Wrench,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, provide, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useInventoryStore } from "@/stores/inventoryStore";
import InventoryTaskDataTable from "../components/InventoryTaskDataTable.vue";
import AllocateDialog from "../components/AllocateDialog.vue";
import {
  fetchBomKey,
  inventorySelectedKey,
  type AllocationMode,
} from "../data";
import RouteSelection from "../components/RouteSelection.vue";
import AllocationForm from "../components/AllocationForm.vue";
import { EmptyResource } from "@/components/app/empty-resource";
import { DataTableLoader } from "@/components/app/data-table";
import WipSkeleton from "@/pages/wip/home/components/WipSkeleton.vue";
import WipDateFilter from "@/pages/wip/home/components/WipDateFilter.vue";

const {
  handleDepartmentSelectionChange,
  selectedDepartment,
  wipTaskGroup,
  fetchBatchWip,
  selectedDateRange,
} = useWip();
const {
  page,
  handleFetchNextPage,
  filter,
  search,
  handleFetchWipGroup,
  statusFilter,
} = useInifiteScroll();
const {
  handleShowAllocateDialogForBatch,
  showAllocateDialog,
  handleShowAllocateDialogForTask,
  fetchBom,
  selectedRoute,
  selectedMode,
  isTaskHasBomAllocated,
} = useBom();
const wipStore = useWipStore();
const { loading: wipLoading } = storeToRefs(wipStore);
const inventoryStore = useInventoryStore();
const { loading: inventoryLoading } = storeToRefs(inventoryStore);

function useInifiteScroll() {
  const page = ref(1);
  const search = ref("");
  const filter = ref<InputFilterDropdownData>(searchFilterData[0]);
  const statusFilter = ref("assigned");

  async function handleFetchNextPage(cb: (canAddMore: boolean) => void) {
    if (!selectedDepartment.value) return;

    const params: Partial<WipPlanQueryParams> = {
      page: ++page.value,
      work_centers: selectedDepartment.value.work_centers,
      filter: statusFilter.value,
    };

    if (search.value) {
      params.filterBy = filter.value.key as WipPlanQueryParams["filterBy"];
      params.keyword = search.value;
    }

    const data = await wipStore.getWipPlansByWorkCenters(params);

    if (data && data.length) wipTaskGroup.value.push(...data);
    else cb(false);
  }

  async function handleFetchWipGroup() {
    if (!selectedDepartment.value) return;

    page.value = 1;
    wipTaskGroup.value = [];
    const params: Partial<WipPlanQueryParams> = {
      page: page.value,
      work_centers: selectedDepartment.value.work_centers,
      filter: statusFilter.value,
    };

    if (search.value) {
      params.filterBy = filter.value.key as WipPlanQueryParams["filterBy"];
      params.keyword = search.value;
    } else {
      params.startDate = selectedDateRange.value?.start;
      params.endDate = selectedDateRange.value?.end;
    }

    const data = await wipStore.getWipPlansByWorkCenters(params);

    if (data && data.length) wipTaskGroup.value = data;
  }

  return {
    page,
    search,
    filter,
    handleFetchNextPage,
    handleFetchWipGroup,
    statusFilter,
  };
}

function useWip() {
  const selectedDepartment = ref<WorkerDepartment>();
  const wipTaskGroup = ref<WipTaskGrouped[]>([]);
  const selectedDateRange = ref<SelectedDateRange>();

  watch(selectedDateRange, async (newValue) => {
    if (newValue?.start && newValue.end && selectedDepartment.value) {
      await handleDepartmentSelectionChange(selectedDepartment.value);
    }
  });

  async function handleDepartmentSelectionChange(department: WorkerDepartment) {
    selectedDepartment.value = department;

    wipStore.pointToMicroservice(department.ms_url);

    search.value = "";
    page.value = 1;
    wipTaskGroup.value = [];
    const data = await wipStore.getWipPlansByWorkCenters({
      page: page.value,
      work_centers: department.work_centers,
      // filter: statusFilter.value,
      startDate: selectedDateRange.value?.start,
      endDate: selectedDateRange.value?.end,
    });

    if (data) wipTaskGroup.value = data;
  }

  async function fetchBatchWip(batch: WipBatch) {
    if (!selectedDepartment.value || (batch.tasks && batch.allocated_boms))
      return;

    const params: Partial<WipTaskQueryParams> = {
      operation_code: selectedDepartment.value.work_centers,
      // filter: statusFilter.value as "assigned",
    };

    const res = await wipStore.getTasksByBatchId(batch.batch_id, params);
    if (res) {
      batch.tasks = res;
    }

    await fetchBom(batch);
  }

  return {
    handleDepartmentSelectionChange,
    selectedDepartment,
    wipTaskGroup,
    fetchBatchWip,
    selectedDateRange,
  };
}

function useBom() {
  const showAllocateDialog = ref(false);
  const selectedBatch = ref<WipBatch>();
  const selectedPlan = ref<WipPlan>();
  const selectedTasks = ref<WipTask[]>();
  const selectedRoute = ref<string>();
  const selectedMode = ref<AllocationMode>("add");

  function handleShowAllocateDialogForBatch(batch: WipBatch, plan: WipPlan) {
    selectedBatch.value = batch;
    selectedPlan.value = plan;
    selectedTasks.value = batch.tasks?.filter((t) => !isTaskHasBomAllocated(t));
    selectedMode.value = "add";

    showAllocateDialog.value = true;
  }

  function handleShowAllocateDialogForTask(
    task: WipTask,
    batch: WipBatch,
    plan: WipPlan,
    mode: AllocationMode = "add",
  ) {
    selectedBatch.value = batch;
    selectedPlan.value = plan;
    selectedTasks.value = [task];
    selectedRoute.value = task.operation_code;
    selectedMode.value = mode;

    showAllocateDialog.value = true;
  }

  async function fetchBom(batch: WipBatch) {
    const inventoryParams = batch.tasks?.map((t) => t.id) || [];
    await inventoryStore.validateToken();
    const inventoryRes =
      await inventoryStore.getInventoryConsumptionByTaskId(inventoryParams);

    batch.allocated_boms = inventoryRes;
  }

  function isTaskHasBomAllocated(task: WipTask) {
    return selectedBatch.value?.allocated_boms?.some(
      (ab) => ab.task_id === task.id,
    );
  }

  provide(
    inventorySelectedKey,
    computed(() => {
      return {
        batch: selectedBatch.value,
        plan: selectedPlan.value,
        tasks: selectedTasks.value,
        route: selectedRoute.value,
      };
    }),
  );

  return {
    showAllocateDialog,
    handleShowAllocateDialogForBatch,
    handleShowAllocateDialogForTask,
    isTaskHasBomAllocated,
    fetchBom,
    selectedBatch,
    selectedPlan,
    selectedTasks,
    selectedRoute,
    selectedMode,
  };
}

provide(fetchBomKey, fetchBom);
</script>

<template>
  <div class="container space-y-6">
    <SectionHeader
      title="BOM Inventory"
      description="Bill of Materials management page"
    />
    <Toolbar @change="handleDepartmentSelectionChange" :loading="wipLoading">
      <template #append>
        <InputFilter
          v-model:search="search"
          v-model:filter="filter"
          :dropdown-data="searchFilterData"
          @submit="handleFetchWipGroup"
          :disabled="!selectedDepartment"
          :loading="wipLoading"
        >
        </InputFilter>
        <WipDateFilter
          class="ml-auto"
          :disabled="search.trim() !== ''"
          :loading="wipLoading"
          v-model="selectedDateRange"
        />
      </template>
    </Toolbar>

    <InfiniteScroll
      @trigger="handleFetchNextPage"
      v-if="wipTaskGroup && wipTaskGroup.length && selectedDepartment"
    >
      <TaskGroup v-for="parentProduct in wipTaskGroup" :key="parentProduct.id">
        <div class="flex basis-full items-center gap-2">
          <TaskGroupImage :image="parentProduct.thumbnail" />
          <TaskGroupLabel label="Parent SKU">
            <RouterLink
              :to="{
                name: 'productShow',
                params: { productId: parentProduct.sku },
              }"
              target="_blank"
            >
              {{ parentProduct.sku }}
            </RouterLink>
          </TaskGroupLabel>
        </div>

        <!-- CHILD -->
        <div
          v-for="(product, index) in parentProduct.product_data"
          :key="product.id"
          class="grow basis-[33rem]"
        >
          <div v-for="plan in product.plan_data" :key="plan.id">
            <div
              class="flex items-center gap-4 rounded-md border bg-muted/20 p-2"
            >
              <TaskGroupImage :image="product.thumbnail || ''" />
              <TaskGroupLabel label="plan code">
                <RouterLink
                  :to="{
                    name: 'taskHistoryIndex',
                    query: { q: plan.code, filter: 'plan_code' },
                  }"
                  target="_blank"
                  class="hover:underline"
                >
                  {{ plan.code }}
                </RouterLink>
              </TaskGroupLabel>
              <TaskGroupLabel label="product SKU">
                <RouterLink
                  :to="{
                    name: 'productShow',
                    params: { productId: product.sku },
                  }"
                  target="_blank"
                  class="hover:underline"
                >
                  {{ product.sku }}
                </RouterLink>
              </TaskGroupLabel>
              <TaskGroupLabel label="product Title">
                <RouterLink
                  :to="{
                    name: 'productShow',
                    params: { productId: product.sku },
                  }"
                  target="_blank"
                  class="hover:underline"
                >
                  {{ product.title }}
                </RouterLink>
              </TaskGroupLabel>
              <div class="ml-auto flex flex-col justify-center gap-2">
                <Badge class="ml-auto gap-1 capitalize">
                  <component
                    :is="getIconByPlanStatus(plan.status_code)"
                    class="size-4"
                  />
                  {{ plan.status_code }}
                </Badge>
                <p class="text-xs text-muted-foreground">
                  {{ formatReadableDate(plan.created_at) }}
                </p>
              </div>
            </div>

            <WipBatchAccordion
              type="multiple"
              :wip-batch="plan.batch_data"
              @select="fetchBatchWip"
              :loading="wipLoading || inventoryLoading"
            >
              <template #default="{ batch }">
                <InventoryTaskDataTable
                  v-if="batch.tasks"
                  :tasks="batch.tasks"
                  :allocated-boms="batch.allocated_boms"
                  :loading="wipLoading || inventoryLoading"
                >
                  <template #header.actions>
                    <TableCell>
                      <WipTaskDropdown
                        v-if="
                          !batch.tasks?.every((t) =>
                            batch.allocated_boms?.some(
                              (ab) => ab.task_id === t.id,
                            ),
                          )
                        "
                      >
                        <template #activator>
                          <ButtonApp
                            class="size-6"
                            variant="outline"
                            size="icon"
                          >
                            <Ellipsis class="size-4" />
                          </ButtonApp>
                        </template>

                        <DropdownMenuLabel>Batch Operations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          @click="handleShowAllocateDialogForBatch(batch, plan)"
                        >
                          <Layers /> Allocate to batch
                        </DropdownMenuItem>
                      </WipTaskDropdown>
                    </TableCell>
                  </template>

                  <template #item.actions="{ item }">
                    <TableCell>
                      <WipTaskDropdown>
                        <template #activator>
                          <Ellipsis
                            class="invisible m-auto size-4 group-hover:visible"
                          />
                        </template>

                        <DropdownMenuLabel>Task Operations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          v-if="
                            batch.allocated_boms?.findIndex(
                              (ab) => ab.task_id === item.id,
                            ) === -1
                          "
                          @click="
                            handleShowAllocateDialogForTask(
                              <WipTask>item,
                              batch,
                              plan,
                            )
                          "
                        >
                          <ArrowRight /> Allocate Materials
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="
                            batch.allocated_boms?.findIndex(
                              (ab) => ab.task_id === item.id,
                            ) !== -1
                          "
                          @click="
                            handleShowAllocateDialogForTask(
                              <WipTask>item,
                              batch,
                              plan,
                              'edit',
                            )
                          "
                        >
                          <Eye />
                          <Pencil /> View/Update
                        </DropdownMenuItem>
                      </WipTaskDropdown>
                    </TableCell>
                  </template>
                </InventoryTaskDataTable>
              </template>
              <template #fallback="{ batch }">
                <DataTableLoader :col-count="4" v-if="!batch.tasks" />
              </template>
            </WipBatchAccordion>
          </div>
        </div>
      </TaskGroup>
      <InfiniteScrollTrigger>
        <WipSkeleton faded />
      </InfiniteScrollTrigger>
    </InfiniteScroll>
    <EmptyResource
      v-else-if="!selectedDepartment"
      title="No Selected Department"
      description="click on the toolbar and select a department to
          start"
      :icon="Building"
    >
    </EmptyResource>
    <EmptyResource
      v-else-if="(!wipTaskGroup || !wipTaskGroup.length) && !wipLoading"
      title="No tasks available"
      description="There are no tasks available at the moment. Please check again later."
      :icon="Wrench"
    />
    <div class="space-y-6" v-else>
      <WipSkeleton />
      <WipSkeleton faded />
    </div>
    <AllocateDialog v-model="showAllocateDialog">
      <RouteSelection v-model="selectedRoute" />
      <AllocationForm
        v-if="selectedRoute"
        :selected-route="selectedRoute"
        class="mt-2"
        :mode="selectedMode"
        @submitted="showAllocateDialog = false"
      />
    </AllocateDialog>
  </div>
</template>

<style scoped></style>
