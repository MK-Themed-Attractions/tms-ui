<script setup lang="ts">
import { storeToRefs } from "pinia";
// Start of UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// End of UI
const emits = defineEmits<{
  (e: "refresh"): void;
}>();
// Stores
import { useCustomLabelStore } from "@/stores/customLabelStore";
import { Info } from "lucide-vue-next";
import LabelDataSourceCard from "./LabelDataSourceCard.vue";
const customLabelStore = useCustomLabelStore();
const { customLabel } = storeToRefs(customLabelStore);
// Functions
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Data Source</CardTitle>
      <CardDescription>Data being used by the Custom Label</CardDescription>
    </CardHeader>
    <CardFooter class="flex gap-2 text-muted-foreground">
      <Info class="size-4"></Info>
      <em class="text-sm"> If the Product SKU is not registered</em>
    </CardFooter>
    <CardContent class="space-y-2">
      <!-- Start of Custom Data -->
      <Accordion
        type="single"
        class="w-full rounded-sm border p-3"
        collapsible
        :default-value="'NewData'"
      >
        <AccordionItem :value="'NewData'">
          <AccordionTrigger> New Data</AccordionTrigger>
          <AccordionContent>
            <LabelDataSourceCard mode="create" @refresh="$emit('refresh')" />
          </AccordionContent>
        </AccordionItem>
        <!-- Start of Existing Custom Data Source -->
        <AccordionItem
          v-if="customLabel"
          v-for="(data, index) in customLabel.custom_data"
          :value="data.sku"
        >
          <AccordionTrigger>Product SKU: {{ data.sku }}</AccordionTrigger>
          <AccordionContent>
            <LabelDataSourceCard
              mode="edit"
              :sumIndex="0"
              @refresh="$emit('refresh')"
            />
          </AccordionContent>
        </AccordionItem>
        <!-- End of Existing Custom Data Source -->
      </Accordion>
      <!-- End of Custom Data -->
    </CardContent>
  </Card>
</template>
