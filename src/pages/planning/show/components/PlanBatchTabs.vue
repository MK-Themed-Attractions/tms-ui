<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <TabsList class="flex-wrap">
      <TabsTrigger v-for="batch in batches" :key="batch.id" :value="batch.id">
        {{ batch.id }}
      </TabsTrigger>
    </TabsList>

    <div class="mt-2 grid min-h-[10rem] rounded-md border border-dashed p-4">
      <div v-if="selectedBatchId && !loading">
        <slot />
      </div>
      <div v-else-if="loading" class="mx-auto self-center">
        <LoaderCircle class="animate-spin" />
      </div>
      <div v-else class="self-center text-center">
        <MousePointerClick class="mx-auto stroke-muted-foreground" />
        <span class="text-muted-foreground">
          Click any batch UUID to view its tasks.
        </span>
      </div>
    </div>
  </Tabs>
</template>

<style scoped></style>
