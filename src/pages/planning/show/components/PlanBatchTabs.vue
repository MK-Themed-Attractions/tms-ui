<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toOrdinal } from "@/lib/utils";
import type { PlanBatch } from "@/types/planning";
import { LoaderCircle, MousePointerClick } from "lucide-vue-next";

const props = defineProps<{
  batches: PlanBatch[];
  loading?: boolean;
}>();
const selectedBatchId = defineModel<string>();
</script>
<template>
  <Tabs v-model="selectedBatchId">
    <div class="flex items-center justify-between gap-2">
      <TabsList>
        <TabsTrigger v-for="batch in batches" :key="batch.id" :value="batch.id">
          {{ toOrdinal(batch.batch_index + 1) }} Batch
        </TabsTrigger>
      </TabsList>

      <div>
        <slot name="append" />
      </div>
    </div>

    <div class="mt-2 grid min-h-[10rem] rounded-md border border-dashed p-4">
      <div v-if="selectedBatchId && !loading">
        <slot />
      </div>
      <div v-else-if="loading" class="mx-auto self-center">
        <LoaderCircle class="animate-spin" />
      </div>
      <div v-else class="self-center text-center">
        <MousePointerClick class="mx-auto mb-2 stroke-muted-foreground" />
        <span class="font-medium text-muted-foreground">
          Click any batch to view its tasks.
        </span>
      </div>
    </div>
  </Tabs>
</template>

<style scoped></style>
