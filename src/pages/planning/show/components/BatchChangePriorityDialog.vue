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
import { usePlanStore } from "@/stores/planStore";
import type { Plan, PlanBatch } from "@/types/planning";
import { ArrowBigDown, ArrowBigUp } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect } from "vue";

const props = defineProps<{
  plan: Plan;
}>();
const dialog = defineModel({ default: false });
const planStore = usePlanStore();
const { loading } = storeToRefs(planStore);
const {
  batchesForm,
  batchMoveUp,
  batchMoveDown,
  activeBatch,
  canMoveDown,
  canMoveUp,
} = useBatch();

function useBatch() {
  const batches = computed(() => props.plan.batches);

  const batchesForm = ref<PlanBatch[]>();

  watchEffect(() => {
    batchesForm.value = JSON.parse(JSON.stringify(batches.value));
  });

  const activeBatch = ref<PlanBatch>();

  function batchMoveUp(batch: PlanBatch) {
    if (!batchesForm.value) {
      console.error("No batch form found");
      return;
    }

    const index = batchesForm.value?.findIndex((e) => e.id === batch.id);
    if (canMoveUp(index)) {
      /* swap position */
      const temp = batchesForm.value[index];
      batchesForm.value[index] = batchesForm.value[index - 1];
      batchesForm.value[index - 1] = temp;

      /* update the activeBatch */
      activeBatch.value = batch;
    }
  }
  function batchMoveDown(batch: PlanBatch) {
    if (!batchesForm.value) {
      console.error("No batch form found");
      return;
    }

    const index = batchesForm.value?.findIndex((e) => e.id === batch.id);

    if (canMoveDown(index)) {
      /* swap position */
      const temp = batchesForm.value[index];
      batchesForm.value[index] = batchesForm.value[index + 1];
      batchesForm.value[index + 1] = temp;

      /* update the activeBatch */
      activeBatch.value = batch;
    }
  }

  function canMoveUp(index: number) {
    return index !== -1 && index > 0;
  }

  function canMoveDown(index: number) {
    if (!batchesForm.value) return false;
    return index !== -1 && index < batchesForm.value.length - 1;
  }

  return {
    batchesForm,
    batchMoveUp,
    batchMoveDown,
    activeBatch,
    canMoveDown,
    canMoveUp,
  };
}

async function handleUpdate() {
  if (!batchesForm.value) {
    console.error("no batch found");
    return;
  }

  /* change the batch_index to be 
  the index (occurence on the list) of the batch
  (based on user prefered arragement of the batches) */
  batchesForm.value = batchesForm.value.map((batch, index) => {
    return {
      ...batch,
      batch_index: index,
    };
  });

  await planStore.updatePlanBatches(props.plan.id, {
    batches: batchesForm.value,
  });
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

      <div class="mt-4 space-y-4 text-sm">
        <ul v-if="batchesForm" class="grid gap-8">
          <li
            v-for="(batch, index) in batchesForm"
            :key="batch.id"
            class="relative flex items-center rounded-md border shadow"
            :class="{ outline: activeBatch && activeBatch.id === batch.id }"
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
              <ButtonApp
                class="h-7 w-6"
                variant="ghost"
                @click="batchMoveUp(batch)"
                :disabled="!canMoveUp(index)"
              >
                <ArrowBigUp />
              </ButtonApp>
              <ButtonApp
                class="h-7 w-6"
                variant="ghost"
                @click="batchMoveDown(batch)"
                :disabled="!canMoveDown(index)"
              >
                <ArrowBigDown />
              </ButtonApp>
            </div>
          </li>
        </ul>
        <ButtonApp class="ml-auto" @click="handleUpdate" :loading="loading"
          >Update</ButtonApp
        >
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
