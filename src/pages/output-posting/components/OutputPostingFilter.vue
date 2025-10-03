<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filters = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "false",
    label: "Pending",
  },
  {
    value: "true",
    label: "Approved",
  },
];

const model = defineModel({ default: "all" });
</script>
<template>
  <Select v-model="model">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="filter in filters"
        :key="filter.value"
        :value="filter.value"
        >{{ filter.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<style scoped></style>
