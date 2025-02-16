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
import type { ProductAttachment } from "@/types/products";
import { File, FileWarning, LoaderCircle } from "lucide-vue-next";

const props = defineProps<{
  title?: string;
  description?: string;
  attachments?: ProductAttachment[];
  loading?: boolean;
}>();

const dialog = defineModel({ default: false });
</script>
<template>
  <Dialog v-model:open="dialog">
    <DialogTrigger as-child>
      <slot name="activator" />
    </DialogTrigger>

    <DialogScrollContent class="max-w-[40rem]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>

      <div v-if="!loading" class="rounded-md border border-dashed">
        <ul class="grid gap-2 p-3 text-sm" v-if="attachments?.length">
          <li
            v-for="attachment in attachments"
            :key="attachment.link"
            class="flex items-center gap-2"
          >
            <File class="" :size="18" />
            <ButtonApp
              as="a"
              variant="link"
              class="whitespace-break-spaces p-0"
              :href="attachment.link"
              target="_blank"
              >{{ attachment.name }}</ButtonApp
            >
          </li>
        </ul>

        <div v-else class="flex items-center gap-2 p-3 text-sm">
          <FileWarning class="stroke-muted-foreground" />
          Sorry, but there's no attachment available for this product
        </div>
      </div>

      <div v-else class="grid min-h-20 place-content-center">
        <LoaderCircle class="mx-auto animate-spin" />
        <p class="text-sm text-muted-foreground">
          Please wait, this may take some time.
        </p>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
