<script setup lang="ts">
import { DataTable } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import { formatReadableDate, getIconByPlanStatus, getS3Link } from "@/lib/utils";
import { type Plan } from "@/types/planning";
import {
  LoaderCircle,
  Menu,
  Pencil,
  Plus,
  Settings,
  Trash,
} from "lucide-vue-next";
import PlanDataTableDropdown from "./PlanDataTableDropdown.vue";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { Router } from "vue-router";
import PlanEditDialog from "../../show/components/PlanEditDialog.vue";
import { ref } from "vue";
import BatchAddDialog from "../../show/components/BatchAddDialog.vue";
import { ImageApp } from "@/components/app/image";

const props = defineProps<{
  plans: Plan[];
}>();
const { handleShowUpdatePlanDialog, selectedPlan, showPlanEditDialog, handleShowAddBatchDialog, showAddBatchDialog } = useActions()

function getPlanTypeIcon(status: "regular" | "prototype") {
  switch (status) {
    case "regular":
      return Menu;
    case "prototype":
      return Settings;
  }
}

function gotoShow(plan: Plan, router: Router) {
  router.push({ name: "planningShow", params: { planId: plan.id } });
}

function useActions() {
  const selectedPlan = ref<Plan>()
  const showPlanEditDialog = ref(false)
  const showAddBatchDialog = ref(false)

  function handleShowUpdatePlanDialog(plan: Plan) {
    selectedPlan.value = plan;
    showPlanEditDialog.value = true
  }
  function handleShowAddBatchDialog(plan: Plan) {
    selectedPlan.value = plan;
    showAddBatchDialog.value = true
  }

  return {
    selectedPlan,
    showPlanEditDialog,
    showAddBatchDialog,
    handleShowUpdatePlanDialog,
    handleShowAddBatchDialog
  }
}
</script>

<template>
  <DataTable :items="plans" @navigate-to="gotoShow">
    <template #item.image="{ item }">
      <TableCell>
        <ImageApp :image="getS3Link(item.product_data?.image?.filename || '', 'small')" class="max-w-10"/>
      </TableCell>
    </template>
    <template #item.plan_data.code="{ item }">
      <TableCell>
        <span class="font-medium">{{ item.plan_data.code }}</span>
      </TableCell>
    </template>
    <template #item.status_code="{ item }">
      <TableCell>
        <div class="flex w-fit items-center gap-2 rounded-md border p-1 text-xs font-medium">
          <component :is="getIconByPlanStatus(item.status_code)" :size="15" class="stroke-muted-foreground" />
          {{ item.status_code }}
        </div>
      </TableCell>
    </template>
    <template #item.plan_data.is_prototype="{ item }">
      <TableCell>
        <div class="flex w-fit items-center gap-2 rounded-md border p-1 text-xs font-medium">
          <component :is="getPlanTypeIcon(
            item.plan_data.is_prototype ? 'prototype' : 'regular',
          )
            " :size="15" class="stroke-muted-foreground" />
          {{ item.plan_data.is_prototype ? "Prototype" : "Regular" }}
        </div>
      </TableCell>
    </template>
    
    <template #item.product_data.sku="{ item }">
      <TableCell v-if="!item.product_data">
        <LoaderCircle class="mx-auto animate-spin stroke-muted-foreground" :size="15" />
      </TableCell>
    </template>
    <template #item.product_data.title="{ item }">
      <TableCell v-if="!item.product_data">
        <LoaderCircle class="mx-auto animate-spin stroke-muted-foreground" :size="15" />
      </TableCell>
    </template>

    <template #item.actions="{ item }">
      <TableCell>
        <PlanDataTableDropdown>
          <DropdownMenuItem @click="handleShowAddBatchDialog(item)">
            <Plus />
            Add batch
          </DropdownMenuItem>
          <DropdownMenuItem @click="handleShowUpdatePlanDialog(item)">
            <Pencil />
            Update plan
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Trash />
            Delete plan
          </DropdownMenuItem>
        </PlanDataTableDropdown>
      </TableCell>
    </template>

    <template #footer>
      <PlanEditDialog v-model="showPlanEditDialog" v-if="selectedPlan" :plan="selectedPlan" />
      <BatchAddDialog v-model="showAddBatchDialog" v-if="selectedPlan" :plan="selectedPlan" />
      <slot name="footer"></slot>

    </template>


  </DataTable>


</template>

<style scoped></style>
