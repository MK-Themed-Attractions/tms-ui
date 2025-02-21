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
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import { Building, LoaderCircle } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { watch, watchEffect } from "vue";

const props = defineProps<{
  loading?: boolean;
}>();
const selectedDepartmentId = defineModel({ default: "" });
const emits = defineEmits<{
  (e: "change", workCenters: string[]): void;
}>();

const workerDepartmentStore = useWorkerDepartmentStore();
const { departments } = storeToRefs(workerDepartmentStore);

if (!departments.value) {
  await workerDepartmentStore.getDepartments();
}

watch(selectedDepartmentId, (newValue) => {
  const workCenters = workerDepartmentStore.getWorkCentersByDeptId(newValue);

  if (workCenters) emits("change", workCenters);
});
</script>
<template>
  <div class="rounded-md border p-4 shadow-sm">
    <Select v-model="selectedDepartmentId">
      <SelectTrigger class="gap-2" :disabled="loading">
        <Building :size="18" />
        <SelectValue
          placeholder="Select a department..."
          class="mr-auto"
        ></SelectValue>
        <LoaderCircle v-if="loading" :size="18" class="animate-spin" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Departments</SelectLabel>
          <SelectItem
            v-for="department in departments"
            :key="department.id"
            :value="department.id"
            >{{ department.name }}</SelectItem
          >
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<style scoped></style>
