<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-vue-next";

const props = defineProps<{
  title: string;
  description: string;
}>();

const dialog = defineModel({ default: false });
</script>
<template>
  <Dialog v-model:open="dialog">
    <slot name="activator">
      <ButtonApp :prepend-icon="Plus" @click="dialog = true"
        >Create plan</ButtonApp
      >
    </slot>

    <DialogScrollContent
      @interact-outside="(e) => e.preventDefault()"
      class="min-h-[30rem] max-w-[55rem]"
    >
      <slot name="header">
        <DialogHeader>
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription>{{ description }}</DialogDescription>
        </DialogHeader>
      </slot>

      <slot />
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
