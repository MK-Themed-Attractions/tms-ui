<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import { EllipsisVertical, Plus, WifiOff } from "lucide-vue-next";
import WorkerAddDialog from "./WorkerDialog.vue";
import { inject, ref, watch } from "vue";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WorkerBatchDeactivateDialog from "./WorkerBatchDeactivateDialog.vue";
import {
  FilterApp,
  type FilterAppGenericObject,
} from "@/components/app/filter";
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import { storeToRefs } from "pinia";
import type { WorkerDepartment, FilterQueryParams } from "@/types/workers";
import { workerOnSuccessKey } from "@/lib/injectionKeys";

const emits = defineEmits<{
  (e: "search", search: string): void;
}>();

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    searchDefaultValue?: string;
  }>(),
  {
    searchDefaultValue: "",
  },
);

const search = ref(props.searchDefaultValue);
const workerDepartmentStore = useWorkerDepartmentStore();
const { departments } = storeToRefs(workerDepartmentStore);
const batchDeactivateDialog = ref(false);
const fetchWorkers = inject(workerOnSuccessKey);
const {
  handleWorkerDepartmentFilter,
  handleWorkerStatusFilter,
  workerStatuses,
  handleClearDepartmentFilter,
  handleClearStatusFilter,
} = useFilter();

function handleShowDeactivateDialog() {
  search.value = "";
  batchDeactivateDialog.value = true;
}

function useFilter() {
  const filters = ref<FilterQueryParams[]>([
    {
      column: "department_id",
      values: [],
    },
    {
      column: "is_active",
      values: [],
    },
  ]);

  /* DATA */
  const workerStatuses: FilterAppGenericObject[] = [
    { id: "true", name: "active" },
    { id: "false", name: "inactive" },
  ];

  async function handleWorkerDepartmentFilter(selected: WorkerDepartment[]) {
    const workerDepartmentIds = selected.reduce<string[]>((acc, cur) => {
      acc.push(cur.id);
      return acc;
    }, []);

    filters.value[0].values = workerDepartmentIds; //index 0 for department_id

    await fetchWithFilter();
  }

  async function handleWorkerStatusFilter(selected: FilterAppGenericObject[]) {
    const workerStatusIds = selected.reduce<string[]>((acc, cur) => {
      acc.push(cur.id);
      return acc;
    }, []);

    filters.value[1].values = workerStatusIds; //index 1 for is_active

    await fetchWithFilter();
  }

  async function handleClearStatusFilter() {
    filters.value[1].values = [];

    await fetchWithFilter();
  }

  async function handleClearDepartmentFilter() {
    filters.value[0].values = [];
    await fetchWithFilter();
  }

  async function fetchWithFilter() {
    if (fetchWorkers)
      await fetchWorkers({
        filters: filters.value,
        page: 1,
      });
  }

  return {
    filters,
    handleWorkerDepartmentFilter,
    handleWorkerStatusFilter,
    handleClearDepartmentFilter,
    handleClearStatusFilter,
    workerStatuses,
  };
}

/**
 * emit a search event when search is empty
 * to refetch the list without search parameter
 */
watch(search, (newValue) => {
  if (!newValue) {
    emits("search", newValue);
  }
});
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <form
      @submit.prevent="emits('search', search)"
      class="flex w-[clamp(10rem,50vw,20rem)] items-center gap-2"
    >
      <Input
        placeholder="Search workers..."
        v-model="search"
        :disabled="loading"
        class="h-9"
      />
    </form>
    <div class="mr-auto flex flex-wrap gap-2">
      <FilterApp
        v-if="departments"
        :items="departments"
        class="max-w-[15rem]"
        text="Department"
        @select="handleWorkerDepartmentFilter"
        @clear-select="handleClearDepartmentFilter"
      >
      </FilterApp>
      <FilterApp
        :items="workerStatuses"
        class="max-w-[15rem]"
        text="Status"
        @select="handleWorkerStatusFilter"
        @clear-select="handleClearStatusFilter"
      >
      </FilterApp>
    </div>

    <div class="flex items-center gap-2">
      <WorkerAddDialog>
        <DialogTrigger>
          <ButtonApp :prepend-icon="Plus">Add</ButtonApp>
        </DialogTrigger>
      </WorkerAddDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <ButtonApp variant="ghost" size="icon">
            <EllipsisVertical />
          </ButtonApp>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="left" align="start">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            class="text-destructive hover:!text-destructive"
            @click="handleShowDeactivateDialog"
          >
            <WifiOff class="stroke-destructive" />
            Deactivate RFID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Deactivate batch worker  Dialog-->
    <WorkerBatchDeactivateDialog
      v-model="batchDeactivateDialog"
    ></WorkerBatchDeactivateDialog>
  </div>
</template>

<style scoped></style>
