<script setup lang="ts">
import { DataTable } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import { formatReadableDate, getIconByPlanStatus } from "@/lib/utils";
import { type Plan } from "@/types/planning";
import {
  LoaderCircle,
  Menu,
  Settings,
} from "lucide-vue-next";
import PlanDataTableDropdown from "./PlanDataTableDropdown.vue";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { Router } from "vue-router";

const props = defineProps<{
  plans: Plan[];
}>();


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
</script>

<template>
  <DataTable :items="plans" @navigate-to="gotoShow">
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

    <template #item.updated_at="{ item }">
      <TableCell>
        <span class="text-muted-foreground">
          {{ formatReadableDate(item.updated_at) }}
        </span>
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
          <DropdownMenuItem>Add batch</DropdownMenuItem>
          <DropdownMenuItem>Update plan</DropdownMenuItem>
          <DropdownMenuItem>Delete plan</DropdownMenuItem>
        </PlanDataTableDropdown>
      </TableCell>
    </template>
  </DataTable>
</template>

<style scoped></style>
