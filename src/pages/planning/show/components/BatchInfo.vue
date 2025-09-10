<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { formatReadableDate } from "@/lib/utils";
import type { Plan, PlanBatch } from "@/types/planning";
import { Pencil, Printer as PrintIcon } from "lucide-vue-next";
import BatchEditDialog from "./BatchEditDialog.vue";
import { computed, ref } from "vue";
import Printer from "@/pages/prints/Printer.vue";

const props = defineProps<{
  batch: PlanBatch;
  plan: Plan;
}>();

const openEditBatchDialog = ref(false);

/* Production Tag */
import ProductionTag from "@/pages/prints/ProductionTag.vue";
import type { TypeProductionTag } from "@/pages/prints/types";
/* Print Production Tag */
import { usePermission } from "@/layouts/main/usePermission";
const { hasPermission } = usePermission();
const PRINT_PROD_TAG_KEY = import.meta.env.VITE_PRINT_PROD_TAG_KEY;
</script>
<template>
  <div class="relative">
    <h3 class="mb-2 font-medium">Batch information</h3>
    <ul class="flex flex-wrap gap-2">
      <li class="basis-[10rem]">
        <p>
          {{ batch.status_code }}
        </p>
        <span class="text-muted-foreground">Status</span>
      </li>
      <li class="basis-[10rem]">
        <p>
          {{ batch.task_qty }}
        </p>
        <span class="text-muted-foreground">Task Qty</span>
      </li>
      <li class="basis-[10rem]">
        <p>
          {{ formatReadableDate(batch.start_date) }}
        </p>
        <span class="text-muted-foreground">Access date</span>
      </li>
      <li class="basis-[10rem]">
        <p>
          {{ batch.id }}
        </p>
        <span class="text-muted-foreground">UUID</span>
      </li>
      <li class="grow basis-[10rem]">
        <Printer v-if="hasPermission(PRINT_PROD_TAG_KEY)">
          <template #activator>
            <ButtonApp variant="ghost" size="icon" class="ml-auto"
              ><PrintIcon /> <span class="sr-only">Print</span></ButtonApp
            >
          </template>
          <template
            :key="value.task_id"
            v-for="value in (props.batch.tasks ?? []).map(
              (item, item_index) => {
                return {
                  plan_code: props.plan.plan_data.code,
                  product_sku: props.plan.product_data.sku,
                  product_title: props.plan.product_data.title,
                  work_centers:
                    props.plan.product_data.routings
                      ?.filter((item) => !item.is_autocomplete)
                      .flatMap((item) => item.workcenters?.name ?? []) ?? [],
                  task_id: item.id,
                  data_index: item_index,
                  data_count: props.batch.tasks?.length,
                };
              },
            )"
          >
            <ProductionTag v-bind="{ ...(value as TypeProductionTag) }" />
          </template>
        </Printer>
      </li>
    </ul>

    <div class="absolute right-0 top-0" v-if="plan.status_code === 'pending'">
      <ButtonApp
        size="icon"
        variant="secondary"
        class="h-6 w-6"
        @click="openEditBatchDialog = true"
      >
        <Pencil />
      </ButtonApp>
    </div>

    <BatchEditDialog
      v-model="openEditBatchDialog"
      :batch="batch"
    ></BatchEditDialog>
  </div>
</template>

<style scoped></style>
