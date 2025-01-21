<script setup lang="ts">
import { DataTable, type DataTableColumns } from "@/components/app/data-table";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableCaption, TableCell, TableRow } from "@/components/ui/table";
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
  <div>
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
  </div>
</template>

<style scoped></style>
