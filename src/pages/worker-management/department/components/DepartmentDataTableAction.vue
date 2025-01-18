<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WorkerDepartment } from "@/types/workers";
import { Pencil } from "lucide-vue-next";

const props = defineProps<{
  workerDepartment: WorkerDepartment;
}>();
const emits = defineEmits<{
  (e: "update", workerDepartment: WorkerDepartment): void;
}>();
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent side="left" align="start">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-bind="props"
        @click="$emit('update', workerDepartment)"
        ><Pencil class="stroke-muted-foreground" /> Update</DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
