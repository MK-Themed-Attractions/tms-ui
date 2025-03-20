<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropdownMenuLabel from "@/components/ui/dropdown-menu/DropdownMenuLabel.vue";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import {
  Building,
  ChevronDown,
  CircleHelp,
  Clock,
  LoaderCircle,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import type { WorkerDepartment } from "@/types/workers";
import { Button } from "@/components/ui/button";
import { ref, watch, watchEffect } from "vue";

const props = defineProps<{
  loading?: boolean;
}>();
const selectedDepartment = defineModel<WorkerDepartment>();

const selectedDepartmentId = ref<string>()
const emits = defineEmits<{
  (e: "change", department: WorkerDepartment): void;
}>();

const workerDepartmentStore = useWorkerDepartmentStore();
const { departments } = storeToRefs(workerDepartmentStore);

if (!departments.value) {
  await workerDepartmentStore.getDepartments();
}

watch(selectedDepartmentId, () => {
  if (!departments.value) return;
  const department = departments.value.find(d => d.id === selectedDepartmentId.value)
  if (department)
    handleDepartmentSelect(department)
})

function handleDepartmentSelect(department: WorkerDepartment) {
  emits('change', department)
}

</script>
<template>
  <div class="rounded-md border p-4 shadow-sm">
    <div class="flex flex-wrap gap-4">
      <Select v-model="selectedDepartmentId">
        <SelectTrigger class="flex-1 basis-[20rem] gap-2" :disabled="loading">
          <Building class="size-5" />
          <SelectValue placeholder="Select a department..." class="mr-auto"></SelectValue>
          <LoaderCircle v-if="loading" class="size-5 animate-spin" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Departments</SelectLabel>
            <SelectItem v-for="department in departments" :key="department.id" :value="department.id">
              {{ department.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <slot name="append">
      </slot>



    </div>
  </div>
</template>

<style scoped></style>
