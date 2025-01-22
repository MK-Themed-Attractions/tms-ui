<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const perPage = defineModel({ default: "30" });
</script>
<template>
  <div>
    <span class="whitespace-nowrap">Rows per page</span>

    <Select v-model="perPage">
      <SelectTrigger class="flex h-8 gap-2">
        <SelectValue class="font-normal"></SelectValue>
      </SelectTrigger>
      <SelectContent side="top">
        <SelectItem
          v-for="pageSize in [10, 20, 30, 40, 50]"
          :key="pageSize"
          :value="`${pageSize}`"
        >
          {{ pageSize }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<style scoped></style>
