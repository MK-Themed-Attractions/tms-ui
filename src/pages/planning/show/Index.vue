<script setup lang="ts">
import { usePlanStore } from "@/stores/planStore";
import ProductImage from "./components/ProductImage.vue";
import { storeToRefs } from "pinia";
import { computed, onDeactivated, ref, watchEffect } from "vue";
import PlanInfo from "./components/PlanInfo.vue";
import PlanBatchTabs from "./components/PlanBatchTabs.vue";
import type { PlanBatch } from "@/types/planning";
import BatchInfo from "./components/BatchInfo.vue";
import TaskInfo from "./components/TaskInfo.vue";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableCell from "@/components/ui/table/TableCell.vue";
import { DataTable } from "@/components/app/data-table";
import { taskColumns } from "./components/data";
import { formatReadableDate } from "@/lib/utils";
import { ButtonApp } from "@/components/app/button";
import { EllipsisVertical } from "lucide-vue-next";

const planStore = usePlanStore();
const { plan } = storeToRefs(planStore);

const productData = computed(() => plan.value?.product_data);
const { selectedBatchId, batch, batchLoading } = useBatch();

function useBatch() {
  const selectedBatchId = ref<string>();
  const batch = ref<PlanBatch>();
  const batchLoading = ref(false);

  watchEffect(async () => {
    if (!plan.value || !selectedBatchId.value) return;

    batchLoading.value = true;
    batch.value = await planStore.getTasks(
      plan.value?.id,
      selectedBatchId.value,
      {
        includes: "tasks",
      },
    );
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
      <PlanInfo v-if="plan" :plan="plan" />

      <div class="col-span-full text-sm">
        <h3 class="border-b pb-2 font-medium">Batches:</h3>

        <div v-if="plan?.batches?.length" class="mt-2">
          <PlanBatchTabs
            v-model="selectedBatchId"
            :batches="plan.batches"
            :loading="batchLoading"
          >
            <div class="space-y-4">
              <BatchInfo :batch="batch" v-if="batch" />
              <Separator />
              <div v-if="batch?.tasks?.length">
                <h3 class="mb-2 font-medium">Task information</h3>

                <div class="rounded-md border shadow">
                  <DataTable :items="batch.tasks" :columns="taskColumns">
                    <template #item.start_date="{ item }">
                      <TableCell>
                        {{ formatReadableDate(item.start_date) }}
                      </TableCell>
                    </template>
                    <template #item.current_operation_data.runtime="{ item }">
                      <TableCell>
                        {{
                          item.current_operation_data.runtime.toLocaleString()
                        }}
                        <span class="text-muted-foreground"> min(s)</span>
                      </TableCell>
                    </template>

                    <template #item.actions="{ item }">
                      <TableCell>
                        <ButtonApp size="icon" variant="ghost" class="h-6 w-6">
                          <EllipsisVertical />
                        </ButtonApp>
                      </TableCell>
                    </template>
                  </DataTable>
                </div>
              </div>
            </div>
          </PlanBatchTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
