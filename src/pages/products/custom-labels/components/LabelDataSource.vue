<template>
  <Card>
    <CardHeader>
      <CardTitle>Data Source</CardTitle>
      <CardDescription>Data being used by the Custom Label</CardDescription>
    </CardHeader>
    <CardFooter> Note: If the Product SKU is not registered </CardFooter>
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
            <NewLabelCustomDataCard @refresh="$emit('refresh')" />
          </AccordionContent>
        </AccordionItem>
        <!-- Start of Existing Custom Data Source -->
        <AccordionItem
          v-for="(data, index) in customLabel.custom_data"
          :value="data.sku"
        >
          <AccordionTrigger>Product SKU: {{ data.sku }}</AccordionTrigger>
          <AccordionContent>
            <LabelCustomDataCard
              @refresh="refresh()"
              :sumIndex="index"
              :data="data"
            ></LabelCustomDataCard>
          </AccordionContent>
        </AccordionItem>
        <!-- End of Existing Custom Data Source -->
      </Accordion>
      <!-- End of Custom Data -->
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { reactive, watch, toRefs, emits } from "vue";
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
import LabelCustomDataCard from "./LabelCustomDataCard.vue";
import NewLabelCustomDataCard from "./NewLabelCustomDataCard.vue";
// End of UI
const emits = defineEmits<{
  (e: "refresh"): void;
}>();
// Stores
import { useCustomLabelStore } from "@/stores/customLabelStore";
const customLabelStore = useCustomLabelStore();
const { customLabel } = storeToRefs(customLabelStore);
// Functions
</script>
