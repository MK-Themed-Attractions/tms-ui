<script setup lang="ts">
import { usePlanStore } from "@/stores/planStore";
import ProductImage from "./components/ProductImage.vue";
import { storeToRefs } from "pinia";
import { computed, onDeactivated, ref, watchEffect } from "vue";
import PlanInfo from "./components/PlanInfo.vue";
import PlanBatchTabs from "./components/PlanBatchTabs.vue";
import BatchInfo from "./components/BatchInfo.vue";

import { Separator } from "@/components/ui/separator";

import TaskDataTable from "./components/TaskDataTable.vue";
import { ButtonApp } from "@/components/app/button";
import { ArrowUpWideNarrow, EllipsisVertical, Plus } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PlanEditDialog from "./components/PlanEditDialog.vue";
import BatchAddDialog from "./components/BatchAddDialog.vue";
import BatchChangePriorityDialog from "./components/BatchChangePriorityDialog.vue";

const planStore = usePlanStore();
const { plan } = storeToRefs(planStore);
const openEditDialog = ref(false);
const openAddBatchDialog = ref(false);
const openBatchChangePriorityDialog = ref(false);

const productData = computed(() => plan.value?.product_data);
const { selectedBatchId, batch, batchLoading } = useBatch();

function useBatch() {
  const selectedBatchId = ref<string>();
  const { batch } = storeToRefs(planStore);
  const batchLoading = ref(false);

  watchEffect(async () => {
    if (!plan.value || !selectedBatchId.value) return;

    batchLoading.value = true;
    await planStore.getBatch(plan.value?.id, selectedBatchId.value, {
      includes: "tasks,routes",
    });
    batchLoading.value = false;
  });

  /* leave the selectedBatchId empty everytime this component deactivated */
  onDeactivated(() => (selectedBatchId.value = undefined));
  return {
    selectedBatchId,
    batch,
    batchLoading,
  };
}
</script>

<template>
  <div class="container">
    <div class="grid gap-4 lg:grid-cols-2">
      <ProductImage v-if="productData" :product="productData" class="mx-auto" />
      <PlanInfo
        v-if="plan"
        :plan="plan"
        @edit="() => (openEditDialog = true)"
      />

      <div class="col-span-full text-sm">
        <h3 class="font-medium">Batches:</h3>
        <p class="border-b pb-2 text-muted-foreground">
          Batches on the left most are processed first.
        </p>

        <div v-if="plan?.batches?.length" class="mt-2">
          <PlanBatchTabs
            v-model="selectedBatchId"
            :batches="plan.batches"
            :loading="batchLoading"
          >
            <template #append>
              <DropdownMenu v-if="plan.status_code === 'pending'">
                <DropdownMenuTrigger>
                  <ButtonApp size="icon" variant="ghost">
                    <EllipsisVertical />
                  </ButtonApp>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="openAddBatchDialog = true">
                      <Plus />
                      Add batch
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="openBatchChangePriorityDialog = true"
                    >
                      <ArrowUpWideNarrow />
                      Change batch priority
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </template>

            <div class="space-y-4">
              <BatchInfo :plan="plan" :batch="batch" v-if="batch" />
              <Separator />
              <div v-if="batch?.tasks?.length">
                <h3 class="mb-2 font-medium">Task information</h3>

                <div class="rounded-md border shadow">
                  <TaskDataTable
                    :tasks="batch.tasks"
                    :plan="plan"
                  />
                </div>
              </div>
            </div>
          </PlanBatchTabs>
        </div>
      </div>
    </div>

    <PlanEditDialog
      v-model="openEditDialog"
      v-if="plan"
      :plan="plan"
      :key="plan.id"
    />

    <BatchAddDialog
      v-if="plan"
      v-model="openAddBatchDialog"
      :key="plan.id"
      :plan="plan"
    />
    <BatchChangePriorityDialog
      v-if="plan"
      v-model="openBatchChangePriorityDialog"
      :plan="plan"
      :key="plan.id"
    />
  </div>
</template>

<style scoped></style>
