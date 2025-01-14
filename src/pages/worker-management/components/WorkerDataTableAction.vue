<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Worker } from "@/types/workers";
import { Pencil, Trash } from "lucide-vue-next";

const props = defineProps<{
  worker: Worker;
}>();
const emits = defineEmits<{
  (e: "update", worker: Worker): void;
  (e: "deactivate", worker: Worker): void;
}>();
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      side="left"
      align="start"
      @pointer-down-outside="(e) => console.log(e)"
    >
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem v-bind="props" @click="$emit('update', worker)"
        ><Pencil class="stroke-muted-foreground" /> Update</DropdownMenuItem
      >

      <DropdownMenuItem
        @click="$emit('deactivate', worker)"
        class="text-destructive hover:!text-destructive"
        ><Trash /> Deactivate</DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
