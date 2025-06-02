<script setup lang="ts">
import { useRoute } from "vue-router";
import type { Router } from "vue-router";
const route = useRoute();
import { storeToRefs } from "pinia";
import { computed, inject, onActivated, ref, watchEffect, reactive } from "vue";
// UI
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/app/data-table";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PaginationApp,
  type PaginationQuery,
} from "@/components/app/pagination";
import { ButtonApp } from "@/components/app/button";
import { LoaderCircle, Search, Printer } from "lucide-vue-next";

// Products
import { useProductStore } from "@/stores/productStore";
const productStore = useProductStore();
const { product } = storeToRefs(productStore);
const curProduct = ref<Product>();
curProduct.value = product.value;
// const fieldsToRemove = [
//   "product_bom_no",
//   "routing_link_code",
//   "routings",
//   "updated_at",
//   "created_at",
//   "id",
// ];
// fieldsToRemove.forEach((field) => {
//   delete curProduct.value[field];
// });
// Custom Labels
import { customLabelColumns } from "../../custom-labels/components/data";
import { useCustomLabelStore } from "@/stores/customLabelStore";
const customLabelStore = useCustomLabelStore();
const {
  fetchCustomLabels,
  handlePagination,
  hasNextPage,
  hasPrevPage,
  customLabels,
} = useCustomLabel();

const search = ref<string>();
await fetchCustomLabels();
const page = ref(1);

function useCustomLabel() {
  const {
    hasNextPage,
    hasPrevPage,
    customLabels,
    errors: planErrors,
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
  };
}

// Custom Label Print Components
import PrintComponentIndex from "../../custom-labels/print-components/Index.vue";
import type { Product } from "@/types/products";
import type { CustomLabel, CustomLabelData } from "@/types/customLabel";
const selectedCustomLabel = ref<CustomLabel>();
// Dialog
const showPrintDialog = ref(false);
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-lg"> Custom Label </CardTitle>
      <CardDescription>Print this product custom label</CardDescription>
    </CardHeader>
    <CardContent>
      <Input placeholder="Search custom labels..." class="h-9 max-w-sm" v-model="search"
        @keydown.enter="fetchCustomLabels()" />
      <DataTable v-if="customLabels" :items="customLabels" :columns="[...customLabelColumns]">
        <template #item.actions="item">
          <ButtonApp :prepend-icon="Printer" size="icon" variant="secondary" class="border my-1" @click="
            () => {
              showPrintDialog = true;
              selectedCustomLabel = item.item;
            }
          "></ButtonApp>
        </template>
        <template #footer>
          <PaginationApp :disable-next="!hasNextPage" :disalble-prev="!hasPrevPage" />
        </template>
      </DataTable>
    </CardContent>

    <!-- Start of Dialog -->
    <Dialog v-model:open="showPrintDialog">
      <DialogTrigger> Activate this Shit </DialogTrigger>
      <DialogScrollContent class="mx-auto flex w-[80vw] max-w-[80vw] flex-col rounded-none p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white border-b p-4">
          <DialogTitle>Custom Label Configuration</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <PrintComponentIndex :customLabel="selectedCustomLabel" :products="[{ ...curProduct }]"
          :dataSource="selectedCustomLabel.custom_data" />
      </DialogScrollContent>
    </Dialog>
    <!-- Start of Dialog -->
  </Card>
</template>
<style scoped></style>
