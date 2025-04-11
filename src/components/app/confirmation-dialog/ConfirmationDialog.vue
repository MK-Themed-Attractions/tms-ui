<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { DialogProps } from ".";
import ButtonApp from "../button/ButtonApp.vue";

const props = withDefaults(defineProps<Partial<DialogProps>>(), {
  title: "Prompt",
  description: "",
  yesMessage: "Yes, im sure",
  noMessage: "No",
  closeOnClickOutside: true
});
const emits = defineEmits<{
  (e: "yes"): void;
  (e: "no"): void;
}>();

const dialog = defineModel({ default: false })
</script>
<template>
  <Dialog v-model:open="dialog">
    <DialogTrigger>
      <slot name="activator" />
    </DialogTrigger>

    <DialogScrollContent @interact-outside="e => closeOnClickOutside ? null : e.preventDefault()">
      <DialogHeader>
        <slot name="title">
          <DialogTitle>{{ title }}</DialogTitle>
        </slot>

        <slot name="description">
          <DialogDescription>
            {{ description }}
          </DialogDescription>
        </slot>
      </DialogHeader>

      <div>
        <slot> Are you sure? </slot>

        <div class="mt-6 flex gap-2">
          <DialogClose>
            <ButtonApp variant="secondary" @click="$emit('yes')">
              {{ yesMessage }}
            </ButtonApp>
          </DialogClose>
          <DialogClose>
            <ButtonApp @click="$emit('no')">{{ noMessage }} </ButtonApp>
          </DialogClose>
        </div>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
