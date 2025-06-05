<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-md">Parameters</CardTitle>
      <CardDescription> </CardDescription>
    </CardHeader>
    <CardContent class="text-sm">
      <div
        class="flex flex-col gap-1 p-2"
        v-for="(parameter, paramIndex) in customLabel.parameters"
      >
        <Label class="text-md mb-1 font-bold">{{ parameter.key }}</Label>
        <Input v-model="customLabel.parameters[paramIndex].value" required />
        <small>{{ parameter.desc }}</small>
      </div>
      <Separator />
      <div ref="printable">
        <div v-for="product in products" v-html="configHTML(product)"></div>
      </div>
    </CardContent>
    <CardFooter>
      <ButtonApp
        class="my-2 bg-green-500"
        :prepend-icon="Printer"
        @click="print"
        >Print Label</ButtonApp
      >
    </CardFooter>
  </Card>
</template>
<script setup lang="ts">
// Set-up
import { ref, useTemplateRef } from "vue";
// UI
import { Printer } from "lucide-vue-next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { ButtonApp } from "@/components/app/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
// Print Controller
import { usePrint } from "@/composables/usePrint";
import type { CustomLabel, CustomLabelData } from "@/types/customLabel";
import type { Product } from "@/types/products";
const printable = useTemplateRef("printable");
const { print } = usePrint(printable, () => {
  emit("afterprint");
});
// TypeScript

// Stores
// Declarations
const props = withDefaults(
  defineProps<{
    autoPrint?: boolean;
    products: Product[];
    customLabel: CustomLabel;
  }>(),
  { autoPrint: true },
);
const dataSource = ref<CustomLabelData[]>();
dataSource.value = props.customLabel.custom_data;

const emit = defineEmits<{
  (e: "afterprint"): void;
}>();
const configHTML = (product: Product) => {
  var html = props.customLabel.html_code;
  const label_parameters = props.customLabel.label_parameters;

  label_parameters.forEach((element) => {
    const regex = new RegExp(element.key, "g");
    html = html.replace(regex, replaceLabelParameter(element.value, product));
  });

  const ItemSource = getData(product.sku);
  if (ItemSource) {
    ItemSource.data.forEach((element) => {
      const regex = new RegExp(element.key, "g");
      html = html.replace(regex, element.value);
    });
  }
  return html;
};
const replaceLabelParameter = (
  paramValue: string,
  product: Product,
): string => {
  switch (paramValue) {
    case "sku":
      return product.sku;
      break;
    case "description":
      return product.description;
      break;
    case "title":
      return product.title;
      break;
    case "parent_code":
      return product.parent_code;
      break;
    case "image":
      return product.images?.[0].filename ?? "No_Image.png";
      break;
    case "Height (cm)":
      return product.dimension_height + " cm";
      break;
    case "Length (cm)":
      return product.dimension_length + " cm";
      break;
    case "Width (cm)":
      return product.dimension_width + " cm";
      break;
    case "Volume (cb.m)":
      return product.volume + " cbm";
      break;
    case "GW (kgs)":
      return product.weight_gross + " kgs";
      break;
    case "NW (kgs)":
      return product.weight_net + " kgs";
      break;
    case "Height (in)":
      return (product.dimension_height / 2.54).toFixed(2) + " in";
      break;
    case "Length (in)":
      return (product.dimension_length / 2.54).toFixed(2) + " in";
      break;
    case "Width (in)":
      return (product.dimension_width / 2.54).toFixed(2) + " in";
      break;
    case "Volume (cb.ft)":
      return (product.volume / 28316.8466).toFixed(2) + " cb.ft";
      break;
    case "GW (lbs)":
      return (product.weight_gross * 2.20462).toFixed(2) + " lbs";
      break;
    case "NW (lbs)":
      return (product.weight_net * 2.20462).toFixed(2) + " lbs";
      break;
  }
  return "Key Not Found";
};
const getData = (sku: string) => {
  const item = dataSource.value?.find((item) => item.sku === sku);
  return item || null;
};
</script>
