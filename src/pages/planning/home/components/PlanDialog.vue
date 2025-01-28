<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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

    <DialogContent @interact-outside="(e) => e.preventDefault()">
      <slot name="header">
        <DialogHeader>
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription>{{ description }}</DialogDescription>
        </DialogHeader>
      </slot>

      <slot />
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
