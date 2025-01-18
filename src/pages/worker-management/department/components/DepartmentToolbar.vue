<script setup lang="ts">
import { Input } from "@/components/ui/input";
import DepartmentDialog from "./DepartmentDialog.vue";
import { ref } from "vue";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-vue-next";
import { ButtonApp } from "@/components/app/button";

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
