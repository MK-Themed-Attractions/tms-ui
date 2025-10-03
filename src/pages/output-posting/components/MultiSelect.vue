<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import { storeToRefs } from "pinia";
import type { WorkerDepartment } from "@/types/workers";
import { cn } from "@/lib/utils";

import { usePermission } from "@/layouts/main/usePermission";
const { hasPermission } = usePermission();
const OUTPUT_POSTING_TO_BC_KEY = import.meta.env.VITE_OUTPUT_POSTING_TO_BC_KEY;

defineOptions({ inheritAttrs: false });

const workerDepartmentStore = useWorkerDepartmentStore();
const { departments } = storeToRefs(workerDepartmentStore);

const emits = defineEmits<{
  (e: "change", departments: WorkerDepartment[]): void;
  (e: "reset"): void;
}>();

const props = defineProps<{ loading?: boolean }>();

const selectedIds = ref<string[]>([]);

const selectedLabel = computed(() => {
  if (selectedIds.value.includes("all")) return "All departments";
  if (!selectedIds.value.length) return "Select departments";

  const names =
    departments.value
      ?.filter((d) => selectedIds.value.includes(d.id))
      .map((d) => d.name) || [];

  return names.length > 3 ? `${names.length} selected` : names.join(", ");
});

function toggleDepartment(id: string, checked: boolean) {
  if (!departments.value?.length) return;

  if (id === "all") {
    if (checked) {
      selectedIds.value = ["all"];

      return emits("change", []);
    }
    return;
  }

  if (checked) {
    selectedIds.value.push(id);
    selectedIds.value = selectedIds.value.filter((v) => v !== "all");
  } else {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);

    const canSelectAll = hasPermission(OUTPUT_POSTING_TO_BC_KEY);

    if (!canSelectAll && selectedIds.value.length === 0) {
      const firstDepartmentId = departments.value[0].id;
      selectedIds.value = [firstDepartmentId];
    }
  }

  const chosen =
    departments.value?.filter((d) => selectedIds.value.includes(d.id)) || [];
  emits("change", chosen);
}

watch(
  departments,
  (newDepartments) => {
    if (!newDepartments?.length) return;

    if (hasPermission(OUTPUT_POSTING_TO_BC_KEY)) {
      selectedIds.value = ["all"];

      emits("change", []);
    } else {
      selectedIds.value = [newDepartments[0].id];

      emits("change", [newDepartments[0]]);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  if (!departments.value) {
    await workerDepartmentStore.getDepartments();
  }
});
</script>

<template>
  <div
    :class="cn('rounded-md border p-4 shadow-sm', $attrs['class'] as string)"
  >
    <div class="flex flex-wrap gap-4">
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            class="flex-1 basis-[20rem] justify-between text-xs"
            :disabled="loading"
          >
            <span>{{ selectedLabel }}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[250px] space-y-2 p-2">
          <label
            v-if="hasPermission(OUTPUT_POSTING_TO_BC_KEY)"
            class="flex items-center gap-2 text-sm"
          >
            <Checkbox
              :checked="selectedIds.includes('all')"
              @update:checked="(val) => toggleDepartment('all', val)"
            />
            All
          </label>

          <label
            v-for="dep in departments"
            :key="dep.id"
            class="flex items-center gap-2 text-sm"
          >
            <Checkbox
              :checked="selectedIds.includes(dep.id)"
              :disabled="
                !hasPermission(OUTPUT_POSTING_TO_BC_KEY) &&
                selectedIds.length === 1 &&
                selectedIds.includes(dep.id)
              "
              @update:checked="(val) => toggleDepartment(dep.id, val)"
            />
            {{ dep.name }}
          </label>
        </PopoverContent>
      </Popover>

      <slot name="append" />
    </div>
  </div>
</template>
