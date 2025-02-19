<script setup lang="ts">
import { ConfirmationDialog } from "@/components/app/confirmation-dialog";
import { Table, TableRow } from "@/components/ui/table";
import TableBody from "@/components/ui/table/TableBody.vue";
import TableCell from "@/components/ui/table/TableCell.vue";
import { formatReadableDate } from "@/lib/utils";
import type { PlanForm } from "@/types/planning";
import type { ProductRouting } from "@/types/products";

const props = defineProps<{
  planFormValues: PlanForm;
  routings: ProductRouting[];
}>();

function getRoutingNameByOperationLetter(letter: string) {
  return props.routings.find((route) => route.operation_number === letter)
    ?.workcenters.name;
}
</script>

<template>
  <ConfirmationDialog
    title="Review"
    description="Please review your plan before proceeding."
  >
    <Table>
      <TableBody class="[&>tr>td:nth-child(2)]:font-medium">
        <TableRow>
          <TableCell>SKU</TableCell>
          <TableCell>{{ planFormValues.sku }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Plan code</TableCell>
          <TableCell>{{ planFormValues.plan_data.code }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Plan description</TableCell>
          <TableCell class="!font-normal italic">{{
            planFormValues.plan_data.description || 'No description provided.'
          }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Plan type</TableCell>
          <TableCell>{{
            planFormValues.plan_data.is_prototype ? "Prototype" : "Regular"
          }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colspan="2" class="!text-left">
            <p>Batches:</p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="(batch, i) in planFormValues.batches"
                :key="i"
                class="flex flex-wrap justify-between gap-2 rounded-md border p-2"
              >
                <div>
                  <p class="font-medium">{{ batch.qty }}</p>
                  <span class="text-muted-foreground">Task qty</span>
                </div>
                <div>
                  <p class="font-medium">
                    {{ formatReadableDate(batch.start_date.toString()) }}
                  </p>
                  <span class="text-muted-foreground">Access date</span>
                </div>
                <div>
                  <p class="font-medium">
                    {{ getRoutingNameByOperationLetter(batch.start_operation) }}
                  </p>
                  <span class="text-muted-foreground">Starting route</span>
                </div>
              </li>
            </ul>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </ConfirmationDialog>
</template>

<style scoped></style>
