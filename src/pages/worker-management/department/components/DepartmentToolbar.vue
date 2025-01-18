<script setup lang="ts">
import { Input } from "@/components/ui/input";
import DepartmentDialog from "./DepartmentDialog.vue";
import { ref, watch, watchEffect } from "vue";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-vue-next";
import { ButtonApp } from "@/components/app/button";

const addDepartmentDialog = ref(false);
const search = defineModel("search", { default: "" });
const emits = defineEmits<{
  (e: "search", search: string): void;
}>();

function closeAddDepartmentDialog() {
  addDepartmentDialog.value = false;
}

/* 
  when search is empty emit the search event
  this could be use to refetch some fresh data
*/

watch(search, (newValue) => {
  if (!newValue) {
    emits("search", newValue);
  }
});
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Input
        placeholder="Search departments..."
        class="w-[clamp(12rem,20vw,20rem)]"
        v-model="search"
        @keydown.enter="$emit('search', search)"
      />
    </div>

    <div>
      <DepartmentDialog>
        <DialogTrigger>
          <ButtonApp :prepend-icon="Plus">Add</ButtonApp>
        </DialogTrigger>
      </DepartmentDialog>
    </div>
  </div>
</template>

<style scoped></style>
