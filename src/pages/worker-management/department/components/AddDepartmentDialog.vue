<script setup lang="ts">
import { ref } from "vue";

import { ButtonApp } from "@/components/app/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
</script>
<template>
  <Dialog>
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent
      @pointer-down-outside="(e) => e.preventDefault()"
      class="max-w-[30rem]"
    >
      <!-- HEADER -->
      <DialogHeader>
        <DialogTitle>Add Department</DialogTitle>
        <DialogDescription
          >Add new department, Click save when your're done.</DialogDescription
        >
      </DialogHeader>

      <!-- CONTENT -->
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="code" class="text-right"> Code </Label>
          <Input id="code" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Name </Label>
          <Input id="name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right"> Description </Label>
          <Input id="description" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <ButtonApp>Save</ButtonApp>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
