<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { ImageApp } from "@/components/app/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { workerOnSuccessKey } from "@/lib/injectionKeys";
import { useWorkerStore } from "@/stores/workerStore";
import type { Worker } from "@/types/workers";
import { Dot, QrCode, X } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { inject, ref } from "vue";
import { toast } from "vue-sonner";

const dialog = defineModel({ default: false });
const {
  searchWorkerByRfid,
  selectedWorkers,
  rfidInput,
  removeWorker,
  handleDeactivateWorkers,
  loading,
} = useDeactivate();
const onSuccess = inject(workerOnSuccessKey);

function useDeactivate() {
  const rfidInput = ref("");
  const selectedWorkers = ref<Worker[]>([]);
  const workerStore = useWorkerStore();
  const { workers, errors, loading } = storeToRefs(workerStore);

  function searchWorkerByRfid() {
    const foundWorker = workers.value?.find((worker) => {
      return worker.rfid_card === rfidInput.value;
    });

    if (foundWorker) {
      if (workerExist(foundWorker)) {
        /* worker already exists */
        toast.warning("Worker exists", {
          description: "Worker is already on the list.",
        });
      } else {
        /* add worker */
        selectedWorkers.value?.push(foundWorker);
      }
    } else {
      /* display a not found toast when no worker has found */
      toast.error("Not Found", {
        description: "No worker was found with that RFID",
      });
    }

    /* reset rfid input every scan */
    rfidInput.value = "";
  }

  /**
   * Check if the worker exist in selectedWorkers list
   * @param worker
   */
  function workerExist(worker: Worker) {
    const foundWorker = selectedWorkers.value.find((w) => {
      return w.id === worker.id;
    });

    return foundWorker ? true : false;
  }

  /**
   * Remove worker from selectedWorkers list
   * @param worker
   */
  function removeWorker(worker: Worker) {
    selectedWorkers.value = selectedWorkers.value.filter((w) => {
      return w.id !== worker.id;
    });
  }

  async function handleDeactivateWorkers() {
    await workerStore.deactivateWorker(selectedWorkers.value);

    if (!errors.value) {
      toast("Success", {
        description: "Workers has been successfully deactivated.",
      });

      selectedWorkers.value = [];

      if (onSuccess) await onSuccess();
    }
  }
  return {
    selectedWorkers,
    searchWorkerByRfid,
    rfidInput,
    removeWorker,
    handleDeactivateWorkers,
    loading,
  };
}
</script>
<template>
  <Dialog v-model:open="dialog">
    <slot
      :props="{
        onClick: () => {
          dialog = true;
        },
      }"
    >
    </slot>

    <DialogScrollContent
      @interact-outside="(e) => e.preventDefault()"
      class="max-w-[40rem]"
    >
      <DialogHeader>
        <DialogTitle>Deactivate RFID</DialogTitle>
        <DialogDescription
          >Deactivate multiple workers at once</DialogDescription
        >
      </DialogHeader>

      <div class="space-y-4 overflow-y-auto p-1">
        <form @submit.prevent="searchWorkerByRfid">
          <div class="relative">
            <QrCode
              class="absolute left-2 top-1/2 -translate-y-1/2 stroke-muted-foreground"
              :size="18"
            />
            <Input class="pl-8" v-model="rfidInput" />
          </div>
          <span class="text-xs text-muted-foreground"
            >Focus on the input field while scanning the RFID to read</span
          >
        </form>

        <div
          class="grid min-h-[10rem] rounded-md border border-dashed bg-secondary p-2 shadow-sm"
        >
          <ul
            class="flex flex-wrap place-content-start gap-2"
            v-if="selectedWorkers.length"
          >
            <li
              v-for="selectedWorker in selectedWorkers"
              :key="selectedWorker.id"
              class="flex items-center rounded-md border bg-white p-2 text-xs shadow-sm"
            >
              <Dot
                :class="{
                  'text-green-500': selectedWorker.is_active,
                  'text-destructive': !selectedWorker.is_active,
                }"
              />
              <p class="mr-2">
                <span class="font-medium">{{
                  selectedWorker.worker_number
                }}</span>
                {{ selectedWorker.full_name }}
              </p>
              <ButtonApp
                class="h-4 rounded-full px-1 py-3"
                variant="ghost"
                @click="removeWorker(selectedWorker)"
              >
                <X />
              </ButtonApp>
            </li>
          </ul>
          <div v-else class="grid place-content-center">
            <ImageApp image="/rfid.png" class="mx-auto max-w-6" />
            <p class="mt-2 text-sm text-muted-foreground">
              Start scanning RFID by clicking on the input field
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <ButtonApp
          @click="handleDeactivateWorkers"
          :disabled="!selectedWorkers.length || loading"
          :loading="loading"
          >Deactivate</ButtonApp
        >
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
