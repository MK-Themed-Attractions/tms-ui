<script setup lang="ts">
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductRouting } from "@/types/products";

const props = defineProps<{
  routings: ProductRouting[];
}>();
</script>
<template>
  <Select>
    <FormControl>
      <SelectTrigger>
        <SelectValue placeholder="Select a starting route"></SelectValue>
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="routing in routings"
          :key="routing.id"
          :value="routing.operation_number"
          >{{ routing.workcenters.name }}</SelectItem
        >
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<style scoped></style>
