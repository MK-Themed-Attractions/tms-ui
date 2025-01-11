<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-vue-next";
import AddDepartmentDialog from "./AddDepartmentDialog.vue";
import { ref } from "vue";

const addDepartmentDialog = ref(false);

function closeAddDepartmentDialog() {
  addDepartmentDialog.value = false;
}
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Input
        placeholder="Search departments..."
        class="w-[clamp(12rem,20vw,20rem)]"
      />
      <ButtonApp size="icon" variant="secondary">
        <Search />
      </ButtonApp>
    </div>

    <div>
      <AddDepartmentDialog> </AddDepartmentDialog>
    </div>
  </div>
</template>

<style scoped></style>
