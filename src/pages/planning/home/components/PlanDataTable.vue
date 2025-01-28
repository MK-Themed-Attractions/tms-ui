<script setup lang="ts">
import { DataTable } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import { formatReadableDate } from "@/lib/utils";
import { PlanStatusCode, type Plan } from "@/types/planning";
import {
  Ban,
  Circle,
  LibraryBig,
  ShieldAlert,
  Timer,
  TrafficCone,
} from "lucide-vue-next";

const props = defineProps<{
  plans: Plan[];
}>();

function getStatusIcon(status: PlanStatusCode) {
  switch (status) {
    case PlanStatusCode.STARTED:
      return Timer;
    case PlanStatusCode.INITIALIZED:
      return Circle;
    case PlanStatusCode.ARCHIVED:
      return LibraryBig;
    case PlanStatusCode.CANCELED:
      return Ban;
    case PlanStatusCode.PROTOTYPE:
      return ShieldAlert;
    default:
      return ShieldAlert;
  }
}
</script>

<template>
  <DataTable :items="plans">
    <template #item.plan_code="{ item }">
      <TableCell>
        <span class="font-medium">{{ item.plan_code }}</span>
      </TableCell>
    </template>
    <template #item.status_code.status="{ item }">
      <TableCell>
        <div class="flex items-center gap-2">
          <component
            :is="getStatusIcon(item.status_code.status)"
            :size="15"
            class="stroke-muted-foreground"
          />
          {{ item.status_code.status }}
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
    <template #item.user_data.full_name="{ item }">
      <TableCell v-if="item.user_data">
        <span class="text-muted-foreground">
          {{ item.user_data.full_name }}
        </span>
      </TableCell>
    </template>
  </DataTable>
</template>

<style scoped></style>
