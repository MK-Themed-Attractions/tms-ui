<script setup lang="ts">
import { DataTable, type DataTableColumns } from "@/components/app/data-table";
import { TableCell } from "@/components/ui/table";
import type { ProductRoutingBOM } from "@/types/products";

const props = defineProps<{
  productRoutingBoms: ProductRoutingBOM[];
}>();

/* INIT */
const columns: DataTableColumns[] = [
  { key: "no", title: "Material code" },
  { key: "description", title: "Description" },
  { key: "quantity_per", title: "Quantity" },
  { key: "unit_of_measure_code", title: "UOM" },
];
</script>
<template>
  <DataTable :items="productRoutingBoms" :columns="columns">
    <template #item.quantity_per="{ item }">
      <TableCell>
        {{ item.quantity_per.toFixed(2) }}
      </TableCell>
    </template>

    <template #footer>
      <div class="bg-white text-center text-muted-foreground mt-2">
        Bill of materials
      </div>
    </template>
  </DataTable>
</template>

<style scoped></style>
