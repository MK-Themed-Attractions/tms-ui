<script setup lang="ts">
import ButtonApp from "@/components/app/button/ButtonApp.vue";
import Button from "@/components/ui/button/Button.vue";
import { CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePrint } from "@/composables/usePrint";
import { Printer } from "lucide-vue-next";
import { useTemplateRef, type Component } from "vue"; // Use Component instead of VueElement
const dialog = defineModel({ default: false });
const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    // data: Record<string, any>[];
    // components: Component;
  }>(),
  {
    title: "Printer Dialog",
    description: "Print everything in the container",
  },
);
const emit = defineEmits<{
  (e: "afterprint"): void;
}>();
const printable = useTemplateRef("printable");
const { print } = usePrint(printable, () => {
  // printable.innerHTML = "";
  // this.$refs.printable.innerHTML = "<strong>This is dynamic content!</strong>";
  emit("afterprint");
});
</script>
<template>
  <Dialog v-model:open="dialog">
    <DialogTrigger as-child>
      <template v-if="$slots.activator">
        <slot name="activator" />
      </template>
      <template v-else>
        <Button class="w-full">Print</Button>
      </template>
    </DialogTrigger>

    <DialogScrollContent
      @interact-outside="(e) => e.preventDefault()"
      class="min-w-full"
    >
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <CardDescription>{{ props.description }}</CardDescription>
      </DialogHeader>

      <div ref="printable" class="">
        <slot />
      </div>
      <ButtonApp
        class="my-2 bg-green-500"
        :prepend-icon="Printer"
        @click="print"
        >Print</ButtonApp
      >
    </DialogScrollContent>
  </Dialog>
</template>
