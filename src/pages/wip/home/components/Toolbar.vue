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
import { watch } from "vue";
import WIPFilter from "./WIPFilter.vue";

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
            <SelectItem v-for="department in departments" :key="department.id" :value="department.id">{{ department.name
            }}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <slot name="append">
      </slot>



    </div>
  </div>
</template>

<style scoped></style>
