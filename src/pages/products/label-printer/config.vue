<script setup lang="ts">
// Vue
import { computed, ref } from "vue";
// Components
import ProductCard from "../components/ProductCard.vue";
import ButtonApp from "@/components/app/button/ButtonApp.vue";

import PrintComponentIndex from "../custom-labels/print-components/Index.vue";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DataTable } from "@/components/app/data-table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Stores
import { useLabelPrintingStore } from "@/stores/labelPrintingStore";
import {
  CircleDotDashedIcon,
  CircleXIcon,
  MinusCircleIcon,
  PlusCircle,
  PrinterIcon,
  ShieldCloseIcon,
} from "lucide-vue-next";
const labelPrintingStore = useLabelPrintingStore();
const selectedProductsEntries = computed(() =>
  Array.from(labelPrintingStore.selectedProducts),
);
function incrementQuantity(sku: string) {
  labelPrintingStore.incrementQuantity(sku);
}
function decrementQuantity(sku: string) {
  labelPrintingStore.decrementQuantity(sku);
}
function onQuantityInputChange(sku: string, quantity: number) {
  labelPrintingStore.updateQuantity(sku, quantity);
}
// Products

// Custom Label
import { useCustomLabelStore } from "@/stores/customLabelStore";
import { storeToRefs } from "pinia";
import type { CustomLabel, CustomLabelQueryParams } from "@/types/customLabel";
import type { PaginationQuery } from "@/components/app/pagination";
import { useRoute } from "vue-router";
const customLabelStore = useCustomLabelStore();
const route = useRoute();
const search = ref<string>();

// Custom Labels
import { customLabelColumns } from "../custom-labels/components/data";
const {
  fetchCustomLabels,
  handlePagination,
  hasNextPage,
  hasPrevPage,
  customLabels,
  labelLoading,
} = useCustomLabel();
function useCustomLabel() {
  const {
    hasNextPage,
    hasPrevPage,
    customLabels,
    errors: planErrors,
    loading: labelLoading,
  } = storeToRefs(customLabelStore);

  async function fetchCustomLabels(params?: Partial<CustomLabelQueryParams>) {
    const res = await customLabelStore.getCustomLabels({
      page: route.query.page ? +route.query.page : undefined,
      per_page: route.query["per-page"]
        ? route.query["per-page"].toString()
        : undefined,
      q: search.value,
      ...params,
    });
  }
  const hasResult = computed(() => customLabels.value?.length);
  async function handlePagination(params: Partial<PaginationQuery>) {
    await fetchCustomLabels({
      page: params.page ? +params.page : undefined,
      per_page: params.perPage,
    });
  }
  return {
    fetchCustomLabels,
    handlePagination,
    hasNextPage,
    hasPrevPage,
    customLabels,
    labelLoading,
  };
}
await fetchCustomLabels();
// Printer Dialog
const selectedCustomLabel = ref<CustomLabel>();
const showPrintDialog = ref(false);
const showDialog = (item: CustomLabel) => {
  showPrintDialog.value = true;
  selectedCustomLabel.value = item;
};
</script>
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="w-full text-start">
      <h1 class="text-lg font-semibold md:text-2xl">Label Printer</h1>
      <p class="text-sm text-muted-foreground">
        List of Selected Products for Label Printing
      </p>
    </div>
    <Accordion type="single" collapsible class="">
      <AccordionItem value="Preview">
        <AccordionTrigger> Custom Labels</AccordionTrigger>
        <AccordionContent>
          <Input
            placeholder="Search custom labels..."
            class="h-9 w-[clamp(10rem,50vw,20rem)]"
            v-model="search"
            @keydown.enter="fetchCustomLabels()"
          />
          <DataTable
            v-if="customLabels"
            :items="customLabels"
            :columns="customLabelColumns"
            :loading="labelLoading"
          >
            <template #item.actions="item">
              <ButtonApp
                :prepend-icon="PrinterIcon"
                size="icon"
                variant="secondary"
                class="my-1"
                @click="showDialog(item.item)"
              >
              </ButtonApp>
            </template>
            <template #footer>
              <PaginationApp
                @change:query="handlePagination"
                :disable-next="!hasNextPage"
                :disalble-prev="!hasPrevPage"
              />
            </template>
          </DataTable>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <!-- Body -->
    <div class="grid grid-cols-3 gap-1">
      <div
        v-for="([sku, item], index) in selectedProductsEntries"
        :key="sku"
        class="flex rounded-sm border p-2"
      >
        <div class="flex justify-center gap-1">
          <button class="" @click="decrementQuantity(sku)">
            <MinusCircleIcon />
          </button>
          <input
            type="number"
            :value="item.quantity"
            @change="onQuantityInputChange(sku, Number($event.target.value))"
            min="1"
            class="w-12 rounded text-center"
          />
          <button class="" @click="incrementQuantity(sku)">
            <plus-circle />
          </button>
        </div>
        <ProductCard
          :product="item.product"
          class="w-full border-none shadow-none hover:shadow-none"
        />
        <CircleXIcon
          :size="48"
          color="red"
          @click="labelPrintingStore.unselectProduct(item.product.sku)"
          class="cursor-pointer"
        />
      </div>
      <RouterLink
        :to="{ name: 'labelPrinter' }"
        class="col-span-3 justify-items-center place-self-center"
      >
        <PlusCircle :size="48" />
        Add Products
      </RouterLink>
    </div>
    <!-- Start of Dialog -->
    <Dialog v-model:open="showPrintDialog">
      <DialogScrollContent
        class="mx-auto flex w-[80vw] max-w-[80vw] flex-col !gap-0 rounded-none p-0"
      >
        <DialogHeader className="sticky top-0 z-10 bg-white border-b p-4">
          <DialogTitle>Custom Label Configuration</DialogTitle>
        </DialogHeader>
        <PrintComponentIndex
          v-if="selectedCustomLabel"
          :customLabel="selectedCustomLabel"
          :products="labelPrintingStore.duplicatedProductList"
        />
      </DialogScrollContent>
    </Dialog>
    <!-- Start of Dialog -->
  </div>
</template>
<style scoped>
input[type="number"]::-webkit-inner-spin-button {
  display: none;
}
</style>
