<template>
  <Card class="border-none">
    <CardHeader>
      <CardTitle class="text-2xl">{{ customLabel.title }}</CardTitle>
      
    </CardHeader>
    <CardContent class="text-sm">
      <CardTitle class="text-md">Parameters</CardTitle>
      <div
        class="flex flex-col gap-1 p-2"
        v-for="(parameter, paramIndex) in customLabel.parameters"
      >
        <Label class="text-md mb-1 font-bold">{{ parameter.key }}</Label>
        <Input v-model="customLabel.parameters[paramIndex].value" required />
        <small>{{ parameter.desc }}</small>
      </div>
      <Separator />
      <ButtonApp
        class="my-2 bg-green-500"
        :prepend-icon="Printer"
        @click="print"
        >Print Label</ButtonApp
      >
    </CardContent>
    <CardFooter>
      <div ref="printable" class="w-full">
        <div v-for="product in products" v-html="configHTML(product)"></div>
      </div>
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
  // printable.innerHTML = "";
  // this.$refs.printable.innerHTML = "<strong>This is dynamic content!</strong>";
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
  // Start of Parameters
  const parameters = props.customLabel.parameters;
  parameters.forEach((element) => {
    const regex = new RegExp(element.key, "g");
    html = html.replace(regex, element.value ?? "");
  });
  // End of Parameters
  // Start of Label Parameters and Custom Label Data Source
  const label_parameters = props.customLabel.label_parameters;
  const ItemSource = getData(product.sku);
  label_parameters.forEach((element) => {
    const regex = new RegExp(element.key, "g");
    var replacementString = replaceLabelParameter(element.value, product);
    if (ItemSource) {
      var dataSourceValue = ItemSource.data.find(
        (keys) => keys.key == element.value,
      );
      if (dataSourceValue) {
        replacementString = dataSourceValue.value;
      }
    }
    html = html.replace(regex, replacementString);
  });
  // End of Label Parameters and Custom Label Data Source
  // Start of Constant Parameters
  if (true) {
    // CurrentDate
    html = html.replace(
      /CurrentDate/g,
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    );
  }
  if (true) {
    // CurrentProductPartName && CurrentProductPartNumber && ProductPartCount
    const mirrorHtml = html;
    if (product.product_parts && product.product_parts.length > 0) {
      html = "";
      product.product_parts.forEach((part, index) => {
        html += mirrorHtml
          .replace(/CurrentProductPartName/g, part.part_description)
          .replace(/CurrentProductPartNumber/g, index + 1)
          .replace(/ProductPartCount/g, product.product_parts.length);
      });
    }
  }
  if (true) {
    // Removal of Constant Parameter
    [
      "CurrentDate",
      "CurrentProductPartName",
      "CurrentProductPartNumber",
      "ProductPartCount",
    ].forEach((param) => {
      const regex = new RegExp(param, "g");
      html = html.replace(regex, "");
    });
  }
  // End of Constant Parameters
  return html;
};
const replaceLabelParameter = (
  paramValue: string,
  product: Product,
): string => {
  switch (paramValue) {
    case "sku":
      return product.sku.replace(/-(EU|US)/, "");
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
  return "";
};
const getData = (sku: string) => {
  const item = dataSource.value?.find((item) => item.sku === sku);
  return item || null;
};
</script>
