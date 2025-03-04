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
  AlarmClock,
  Building,
  ChevronDown,
  CircleHelp,
  Clock,
  LoaderCircle,
  PlayCircle,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-vue-next";
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
      <div class="relative grow items-center">
        <Input id="search" type="text" placeholder="Search..." class="pl-10 pr-[9rem]" />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
          <Search class="size-5 text-muted-foreground" />
        </span>

        <div class="absolute inset-y-0 right-0 flex max-w-[10rem] items-center gap-2 p-1">
          <Separator orientation="vertical" class="h-5" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ButtonApp size="sm" variant="ghost">
                Product SKU
                <ChevronDown class="size-5" />
              </ButtonApp>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Search by</DropdownMenuLabel>
                <DropdownMenuItem>Product SKU</DropdownMenuItem>
                <DropdownMenuItem>Plan code</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div class="basis-full">
        <div class="flex border rounded-md w-fit">
          <ButtonApp variant="none" :prepend-icon="CircleHelp" class="rounded-none hover:bg-muted text-xs">
            Unassigned
          </ButtonApp>
          <ButtonApp variant="none" :prepend-icon="Clock" class="rounded-none hover:bg-muted text-xs">
            Pending
          </ButtonApp>
          <ButtonApp variant="none" :prepend-icon="RefreshCcw" class="rounded-none hover:bg-muted text-xs">
            Ongoing
          </ButtonApp>
          <ButtonApp variant="none" :prepend-icon="XCircle" class="rounded-none hover:bg-muted text-xs">
            QC failed
          </ButtonApp>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped></style>
