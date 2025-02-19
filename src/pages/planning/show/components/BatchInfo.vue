<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { formatReadableDate } from "@/lib/utils";
import type { PlanBatch } from "@/types/planning";
import { Pencil } from "lucide-vue-next";
import BatchEditDialog from "./BatchEditDialog.vue";
import { ref } from "vue";

const props = defineProps<{
  batch: PlanBatch;
}>();

const openEditBatchDialog = ref(false);
</script>
<template>
  <div class="relative">
    <h3 class="mb-2 font-medium">Batch information</h3>
    <ul class="flex flex-wrap gap-2">
      <li class="basis-[10rem]">
        <p>
          {{ batch.status_code }}
        </p>
        <span class="text-muted-foreground">Status</span>
      </li>
      <li class="basis-[10rem]">
        <p>
          {{ batch.task_qty }}
        </p>
        <span class="text-muted-foreground">Task Qty</span>
      </li>
      <li class="basis-[10rem]">
        <p>
          {{ formatReadableDate(batch.start_date) }}
        </p>
        <span class="text-muted-foreground">Access date</span>
      </li>
      <li class="basis-[10rem]">
        <p>
          {{ batch.id }}
        </p>
        <span class="text-muted-foreground">UUID</span>
      </li>
    </ul>

    <div class="absolute right-0 top-0">
      <ButtonApp
        size="icon"
        variant="secondary"
        class="h-6 w-6"
        @click="openEditBatchDialog = true"
      >
        <Pencil />
      </ButtonApp>
    </div>

    <BatchEditDialog
      v-model="openEditBatchDialog"
      :batch="batch"
    ></BatchEditDialog>
  </div>
</template>

<style scoped></style>
