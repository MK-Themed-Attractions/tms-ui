<script setup lang="ts">
import { formatReadableDate } from "@/lib/utils";
import { taskColumns } from "./data";
import type { BatchTask } from "@/types/planning";
import { DataTable } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import { History, MoreHorizontal, Settings } from "lucide-vue-next";
import type { RouteLocationAsRelativeGeneric } from "vue-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePlanStore } from "@/stores/planStore";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";

const props = defineProps<{
  tasks: BatchTask[];
}>();

const planStore = usePlanStore()
const { loading: planLoading, errors: planErrors } = storeToRefs(planStore)
function taskHistory(item: BatchTask) {
  return {
    name: 'taskHistoryIndex',
    query: {
      workCenter: item.current_operation_data.operation_code,
      batch: item.batch_id,
      task: item.id,
      q: item.id,
    }
  } as RouteLocationAsRelativeGeneric
}

async function handleOverride(item: BatchTask) {
  const { id: planTaskId, plan_id, batch_id } = item

  await planStore.overrideTask(plan_id, batch_id, planTaskId, {
    status_code: 'override'
  })

  if (!planErrors) {
    toast.info('Override Success Info', {
      description: 'task successfully overridden, it will now move to the next process.'
    })
  } else
    toast.error('Override Error Info', {
      description: 'something went wrong while overriding this task'
    })
}
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
              <DropdownMenuItem v-if="item.status_code === 'qc-passed'" @select="handleOverride(item)">
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
