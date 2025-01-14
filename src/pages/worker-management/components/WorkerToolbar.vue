<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, WifiOff } from "lucide-vue-next";
import WorkerAddDialog from "./WorkerDialog.vue";
import { ref, watch, watchEffect } from "vue";
import { DialogTrigger } from "@/components/ui/dialog";

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

    <div class="flex gap-2">
      <WorkerAddDialog>
        <DialogTrigger>
          <ButtonApp :prepend-icon="Plus">Add</ButtonApp>
        </DialogTrigger>
      </WorkerAddDialog>
      <ButtonApp variant="outline" :prepend-icon="WifiOff"
        >Deactivate RFID</ButtonApp
      >
    </div>
  </div>
</template>

<style scoped></style>
