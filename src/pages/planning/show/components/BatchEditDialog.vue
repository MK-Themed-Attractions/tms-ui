<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

import type { PlanBatch } from "@/types/planning";

import BatchDateForm from "./BatchDateForm.vue";
import BatchTaskForm from "./BatchTaskForm.vue";

const props = defineProps<{
  batch: PlanBatch;
}>();
const dialog = defineModel({ default: false });
</script>
<template>
  <Dialog v-model:open="dialog">
    <DialogScrollContent @interact-outside="(e) => e.preventDefault()">
      <DialogHeader>
        <DialogTitle>Edit batch information</DialogTitle>
        <DialogDescription
          >Edit necessary information, save when done.</DialogDescription
        >
      </DialogHeader>

      <div class="space-y-6">
        <BatchDateForm :batch="batch" @submited="dialog = false" />

        <Separator />

        <BatchTaskForm :batch="batch" @submited="dialog = false" />
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
