<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { DialogProps } from ".";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import ButtonApp from "../button/ButtonApp.vue";

const props = withDefaults(defineProps<Partial<DialogProps>>(), {
  title: "Prompt",
  description: "",
  yesMessage: "Yes, im sure",
  noMessage: "No",
});
const emits = defineEmits<{
  (e: "yes"): void;
  (e: "no"): void;
}>();
</script>
<template>
  <Dialog>
    <DialogTrigger>
      <slot name="activator" />
    </DialogTrigger>

    <DialogContent>
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
          <ButtonApp variant="secondary" @click="$emit('yes')">
            {{ yesMessage }}
          </ButtonApp>
          <DialogClose>
            <ButtonApp @click="$emit('no')">{{ noMessage }} </ButtonApp>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
