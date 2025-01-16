<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import {
  Ellipsis,
  EllipsisVertical,
  Plus,
  Search,
  Wifi,
  WifiOff,
} from "lucide-vue-next";
import WorkerAddDialog from "./WorkerDialog.vue";
import { ref, watch, watchEffect } from "vue";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WorkerBatchDeactivateDialog from "./WorkerBatchDeactivateDialog.vue";

const emits = defineEmits<{
  (e: "search", search: string): void;
}>();
const props = withDefaults(
  defineProps<{
    loading?: boolean;
    searchDefaultValue?: string;
  }>(),
  {
    searchDefaultValue: "",
  },
);

const search = ref(props.searchDefaultValue);
const batchDeactivateDialog = ref(false);

function handleShowDeactivateDialog() {
  search.value = "";
  batchDeactivateDialog.value = true;
}

/**
 * emit a search event when search is empty
 * to refetch the list without search parameter
 */
watch(search, (newValue) => {
  if (!newValue) {
    emits("search", newValue);
  }
});
</script>

<template>
  <div class="flex justify-between">
    <form
      @submit.prevent="emits('search', search)"
      class="flex w-[clamp(20rem,50vw,30rem)] items-center gap-2"
    >
      <Input
        placeholder="Search workers..."
        v-model="search"
        :disabled="loading"
      />
      <ButtonApp
        variant="secondary"
        size="icon"
        :loading="loading"
        type="submit"
        ><Search v-if="!loading" />
      </ButtonApp>
    </form>

    <div class="flex items-center gap-2">
      <WorkerAddDialog>
        <DialogTrigger>
          <ButtonApp :prepend-icon="Plus">Add</ButtonApp>
        </DialogTrigger>
      </WorkerAddDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <ButtonApp variant="ghost" size="icon">
            <EllipsisVertical />
          </ButtonApp>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="left" align="start">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            class="text-destructive hover:!text-destructive"
            @click="handleShowDeactivateDialog"
          >
            <WifiOff class="stroke-destructive" />
            Deactivate RFID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Deactivate batch worker  Dialog-->
    <WorkerBatchDeactivateDialog
      v-model="batchDeactivateDialog"
    ></WorkerBatchDeactivateDialog>
  </div>
</template>

<style scoped></style>
