<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { DataTable } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import { formatReadableDate } from "@/lib/utils";
import { PlanStatusCode, type Plan } from "@/types/planning";
import {
  Ban,
  Circle,
  Clock8,
  EllipsisVertical,
  LibraryBig,
  ShieldAlert,
  Timer,
} from "lucide-vue-next";
import PlanDataTableDropdown from "./PlanDataTableDropdown.vue";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { Router } from "vue-router";

const props = defineProps<{
  plans: Plan[];
}>();

function getStatusIcon(status: string) {
  switch (status) {
    case PlanStatusCode[1]:
      return Timer;
    case PlanStatusCode[0]:
      return Circle;
    case PlanStatusCode[3]:
      return LibraryBig;
    case PlanStatusCode[2]:
      return Ban;
    case PlanStatusCode[4]:
      return ShieldAlert;
    case PlanStatusCode[5]:
      return Clock8;
    default:
      return ShieldAlert;
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
        <div
          class="flex w-fit items-center gap-2 rounded-md border p-1 text-xs font-medium"
        >
          <component
            :is="getStatusIcon(item.status_code.toString())"
            :size="15"
            class="stroke-muted-foreground"
          />
          {{ item.status_code }}
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
    <template #item.user_data.given_name="{ item }">
      <TableCell v-if="item.user_data">
        <span class="text-muted-foreground">
          {{ item.user_data.given_name }}
        </span>
      </TableCell>
    </template>

    <template #item.actions="{ item }">
      <TableCell>
        <PlanDataTableDropdown>
          <template #activator>
            <ButtonApp variant="ghost" size="icon" class="h-6 w-6">
              <EllipsisVertical />
            </ButtonApp>
          </template>

          <DropdownMenuItem>Add batch</DropdownMenuItem>
          <DropdownMenuItem>Update plan</DropdownMenuItem>
          <DropdownMenuItem>Delete plan</DropdownMenuItem>
        </PlanDataTableDropdown>
      </TableCell>
    </template>
  </DataTable>
</template>

<style scoped></style>
