<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatReadableDate, toOrdinal } from "@/lib/utils";
import type { Plan, PlanBatch } from "@/types/planning";
import { ArrowBigDown, ArrowBigUp } from "lucide-vue-next";
import { computed, ref, watchEffect } from "vue";

const props = defineProps<{
  plan: Plan;
}>();
const dialog = defineModel({ default: false });
const { batchesForm } = useBatch();

function useBatch() {
  const batches = computed(() => props.plan.batches);
  const batchesForm = ref<PlanBatch[]>();

  watchEffect(() => {
    batchesForm.value = batches.value;
  });

  function batchMoveUp(batch: PlanBatch) {
    if(canMoveUp(batch)) {
      batchesForm.value?.fill
    }
  }

  function canMoveUp(batch: PlanBatch) {
    if (!batchesForm.value) return false;
    return batchesForm.value?.findIndex((b) => b.id === batch.id) > 0;
  }

  return {
    batches,
    batchesForm,
  };
}
</script>
<template>
  <Dialog v-model:open="dialog">
    <DialogScrollContent
      @interact-outside="(e) => e.preventDefault()"
      class="max-w-[35rem]"
    >
      <DialogHeader>
        <DialogTitle>Change batch priority</DialogTitle>
        <DialogDescription
          >Change a batch priority by clicking on up or down arrow on the right
          side, press update when done arranging.</DialogDescription
        >
      </DialogHeader>

      <div class="mt-4 text-sm">
        <ul v-if="batchesForm" class="grid gap-8">
          <li
            v-for="(batch, index) in batchesForm"
            :key="batch.id"
            class="relative flex items-center rounded-md border shadow"
          >
            <Badge
              class="absolute -top-4 left-0 rounded-bl-none outline-primary"
              variant="secondary"
              >{{ toOrdinal(index + 1) }} priority</Badge
            >
            <div
              class="inline-flex grow flex-wrap items-center justify-between gap-4"
            >
              <div class="p-2">
                <p class="font-medium">{{ batch.task_qty }}</p>
                <span class="text-muted-foreground">Qty</span>
              </div>
              <div class="p-2">
                <p class="font-medium">
                  {{ formatReadableDate(batch.start_date) }}
                </p>
                <span class="text-muted-foreground">Access date</span>
              </div>
              <div class="p-2">
                <p class="font-medium">
                  {{ batch.status_code }}
                </p>
                <span class="text-muted-foreground">Status</span>
              </div>
              <div class="p-2">
                <p class="font-medium">
                  {{ batch.batch_index + 1 }}
                </p>
                <span class="text-muted-foreground">Batch no.</span>
              </div>
            </div>
            <div class="border-l">
              <ButtonApp class="h-7 w-6" variant="ghost">
                <ArrowBigUp />
              </ButtonApp>
              <ButtonApp class="h-7 w-6" variant="ghost">
                <ArrowBigDown />
              </ButtonApp>
            </div>
          </li>
        </ul>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
