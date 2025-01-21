<script setup lang="ts">
import { useProductStore } from "@/stores/productStore";
import type {
  ProductRoutingBOM,
  ProductQueryParameter,
} from "@/types/products";
import { storeToRefs } from "pinia";
import ImageCarousel from "./components/ImageCarousel.vue";
import ProductDetails from "./components/ProductDetails.vue";
import { Card } from "@/components/ui/card";
import ProductRouting from "./components/ProductRouting.vue";
import { computed, inject, onActivated, ref, watch, watchEffect } from "vue";
import { ImageApp } from "@/components/app/image";
import ProductRoutingBoms from "./components/ProductRoutingBoms.vue";
import { LoaderCircle, MousePointerClick } from "lucide-vue-next";
import ProductRoutingInfo from "./components/ProductRoutingInfo.vue";
import { mainScrollerKey } from "@/lib/injectionKeys";

const props = defineProps<{
  productId: string;
}>();
const productStore = useProductStore();
const { loading } = storeToRefs(productStore);

const { fetchProduct, product } = useProduct();
const { selectedRouting, productRoutingBoms, routing } = useRouting();

function useProduct() {
  const { product } = storeToRefs(productStore);

  async function fetchProduct(
    productId: string,
    params?: Partial<ProductQueryParameter>,
  ) {
    await productStore.getProduct(productId, {
      includes: "routings,images",
      ...params,
    });
  }

  return {
    fetchProduct,
    product,
  };
}

function useRouting() {
  const selectedRouting = ref("");
  const productRoutingBoms = ref<ProductRoutingBOM[]>();

  watchEffect(async () => {
    if (selectedRouting.value) {
      productRoutingBoms.value = await productStore.getProductRoutingBom(
        props.productId,
        {
          routing_link_code: selectedRouting.value,
        },
      );
    }
  });

  /**
   * The currently selected routing object
   */
  const routing = computed(() => {
    return product.value?.routings?.find(
      (r) => r.operation_code === selectedRouting.value,
    );
  });
  return {
    selectedRouting,
    productRoutingBoms,
    routing,
  };
}

/* INIT */
watchEffect(async () => {
  await fetchProduct(props.productId);
});

/**
 * Always scroll to top when user navigate to this page
 */
const scroller = inject(mainScrollerKey);
const { scrollMainTo } = scroller ? scroller() : { scrollMainTo: null };

onActivated(() => {
  if (scrollMainTo) {
    scrollMainTo(0);
  }
});
</script>
<template>
  <div class="grid gap-4 px-4 lg:grid-cols-2">
    <Card>
      <ImageCarousel
        v-if="product?.images"
        :images="product?.images"
      ></ImageCarousel>
    </Card>

    <ProductDetails v-if="product" :product="product" />

    <ProductRouting
      v-model="selectedRouting"
      v-if="product?.routings"
      :routings="product?.routings"
      class="col-span-full"
    >
      <ProductRoutingInfo :routing="routing" v-if="routing" class="mt-4" />

      <ProductRoutingBoms
        v-if="productRoutingBoms && !loading"
        :product-routing-boms="productRoutingBoms"
        class="mt-4"
      ></ProductRoutingBoms>

      <div
        v-else
        class="mt-4 grid min-h-[10rem] place-content-center rounded-md border border-dashed"
      >
        <LoaderCircle class="animate-spin" v-if="loading" />

        <div
          class="text-muted-foreground"
          v-if="!productRoutingBoms && !loading"
        >
          <MousePointerClick class="mx-auto" />
          <p class="text-sm font-medium">
            Click on any routing to view its data
          </p>
        </div>
      </div>
    </ProductRouting>
  </div>
</template>

<style scoped></style>
