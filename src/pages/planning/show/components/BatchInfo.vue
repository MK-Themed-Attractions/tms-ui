<script setup lang="ts">
import { formatReadableDate } from "@/lib/utils";
import type { PlanBatch } from "@/types/planning";

const props = defineProps<{
  batch: PlanBatch;
}>();
</script>
<template>
  <div>
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
  </div>
</template>

<style scoped></style>
