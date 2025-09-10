<script setup lang="ts">
import { formatReadableDate } from "@/lib/utils";
import { taskColumns } from "./data";
import type { BatchTask, Plan } from "@/types/planning";
import { DataTable } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import {
  History,
  MoreHorizontal,
  Settings,
  Printer as PrintIcon,
} from "lucide-vue-next";
import type { RouteLocationAsRelativeGeneric } from "vue-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlanStore } from "@/stores/planStore";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";
import ProductionTag from "@/pages/prints/ProductionTag.vue";
import Printer from "@/pages/prints/Printer.vue";

const props = defineProps<{
  tasks: BatchTask[];
  plan: Plan;
}>();

const planStore = usePlanStore();
const { loading: planLoading, errors: planErrors } = storeToRefs(planStore);
function taskHistory(item: BatchTask) {
  return {
    name: "taskHistoryIndex",
    query: {
      workCenter: item.current_operation_data.operation_code,
      batch: item.batch_id,
      task: item.id,
      q: item.id,
    },
  } as RouteLocationAsRelativeGeneric;
}

async function handleOverride(item: BatchTask) {
  const { id: planTaskId, plan_id, batch_id } = item;

  await planStore.overrideTask(plan_id, batch_id, planTaskId, {
    status_code: "override",
  });

  if (!planErrors.value) {
    toast.info("Override Success Info", {
      description:
        "task successfully overridden, it will now move to the next process.",
    });
  } else
    toast.error("Override Error Info", {
      description: "something went wrong while overriding this task",
    });
}
/* Print Production Tag */
import { usePermission } from "@/layouts/main/usePermission";
const { hasPermission } = usePermission();
const PRINT_PROD_TAG_KEY = import.meta.env.VITE_PRINT_PROD_TAG_KEY;
</script>

<template>
  <DataTable :items="tasks" :columns="taskColumns">
    <template #item.start_date="{ item }">
      <TableCell>
        {{ formatReadableDate(item.start_date) }}
      </TableCell>
    </template>
    <template #item.current_operation_data.runtime="{ item }">
      <TableCell>
        {{ item.current_operation_data.runtime.toLocaleString() }}
        <span class="text-muted-foreground"> min(s)</span>
      </TableCell>
    </template>

    <template #item.actions="{ item }">
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal class="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem as-child>
                <RouterLink :to="taskHistory(item)" target="_blank">
                  <History /> View Task history
                </RouterLink>
              </DropdownMenuItem>

              <Printer v-if="hasPermission(PRINT_PROD_TAG_KEY)">
                <template #activator>
                  <DropdownMenuItem @select="(e) => e.preventDefault()"
                    ><PrintIcon />Print Prod Tag
                  </DropdownMenuItem>
                </template>
                <ProductionTag
                  :key="item.id"
                  v-bind="{
                    plan_code: plan.plan_data.code,
                    product_sku: plan.product_data.sku,
                    product_title: plan.product_data.title,
                    work_centers:
                      plan.product_data.routings
                        ?.filter((item) => !item.is_autocomplete)
                        .flatMap((item) => item.workcenters?.name ?? []) ?? [],
                    task_id: item.id,
                    data_index: item.task_index,
                    data_count: tasks.length,
                  }"
                />
              </Printer>

              <DropdownMenuItem
                v-if="item.status_code === 'qc-passed'"
                @select="handleOverride(item)"
              >
                <Settings />
                Override
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </template>
  </DataTable>
</template>

<style scoped></style>
