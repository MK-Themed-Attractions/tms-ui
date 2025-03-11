<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from "@/components/ui/dialog";

import type { PlanBatch } from "@/types/planning";

import BatchDateForm from "./BatchDateForm.vue";
import BatchTaskForm from "./BatchTaskForm.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const props = defineProps<{
  batch: PlanBatch;
}>();
const dialog = defineModel({ default: false });
</script>
<template>
  <Dialog v-model:open="dialog">
    <DialogScrollContent @interact-outside="(e) => e.preventDefault()">
      <DialogHeader>
        <DialogTitle>Edit batch information</DialogTitle>
        <DialogDescription>Edit necessary information, save when done.</DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <Tabs default-value="date">
          <TabsList class="w-full *:grow">
            <TabsTrigger value="date">
              Change Schedule
            </TabsTrigger>
            <TabsTrigger value="qty">
              Add Tasks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="date">
            <BatchDateForm :batch="batch" @submited="dialog = false" />
          </TabsContent>
          <TabsContent value="qty">
            <BatchTaskForm :batch="batch" @submited="dialog = false" />

          </TabsContent>
        </Tabs>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
