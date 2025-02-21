<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductStore } from "@/stores/productStore";
import { storeToRefs } from "pinia";

const selectedWorkCenterId = defineModel({ default: "" });

const productStore = useProductStore();
const { workCenters } = storeToRefs(productStore);

if (!workCenters.value) {
  await productStore.getWorkCenters();
}
</script>
<template>
  <div class="rounded-md border p-4 shadow-sm">
    <Select v-model="selectedWorkCenterId">
      <SelectTrigger>
        <SelectValue placeholder="Select a work center..."></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Work Centers</SelectLabel>
          <SelectItem
            v-for="workCenter in workCenters"
            :key="workCenter.no"
            :value="workCenter.no"
            >{{ workCenter.name }}</SelectItem
          >
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<style scoped></style>
