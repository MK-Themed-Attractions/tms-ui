<script setup lang="ts">
import { useProductStore } from "@/stores/productStore";
import type {
  ProductRoutingBOM,
  ProductQueryParameter,
  ProductAttachment,
  ProductResource,
} from "@/types/products";
import { storeToRefs } from "pinia";
import ImageCarousel from "./components/ImageCarousel.vue";
import ProductDetails from "./components/ProductDetails.vue";
import { Card } from "@/components/ui/card";
import ProductRouting from "./components/ProductRouting.vue";
import { computed, inject, onActivated, ref, watchEffect } from "vue";
import ProductRoutingBoms from "./components/ProductRoutingBoms.vue";
import {
  Axis3D,
  LoaderCircle,
  MousePointerClick,
  Notebook,
  PaintBucket,
  Paperclip,
} from "lucide-vue-next";
import ProductRoutingInfo from "./components/ProductRoutingInfo.vue";
import { mainScrollerKey } from "@/lib/injectionKeys";
import { ButtonApp } from "@/components/app/button";
import ProductAttachmentDropdown from "./components/ProductAttachmentDropdown.vue";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AttachmentDialog from "./components/AttachmentDialog.vue";
import IndexSkeleton from "./components/IndexSkeleton.vue";
import ProductCustomLabel from "./components/ProductCustomLabel.vue";
import { productResourceTypes, type ProductResourceType } from ".";

const props = defineProps<{
  productId: string;
}>();
const productStore = useProductStore();
const { fetchProduct, product, loading } = useProduct();
const { selectedRouting, productRoutingBoms, routing, routingLoading, defaultSelectedRouting } = useRouting();
const {
  attachmentDialog,
  attachmentLoading,
  attachments,
  handleSelectAttachment,
  selectedAttachment,
  fetchAttachments,
  selectedAttachmentType,
} = useAttachments();

function useProduct() {
  const { product } = storeToRefs(productStore);
  const loading = ref(false)
  async function fetchProduct(
    productId: string,
    params?: Partial<ProductQueryParameter>,
  ) {
    loading.value = false
    loading.value = true
    await productStore.getProduct(productId, {
      includes: "routings,images,product_parts",
      ...params,
    });
    loading.value = false

  }

  return {
    fetchProduct,
    product,
    loading
  };
}

function useRouting() {

  const defaultSelectedRouting = computed(() => product.value?.routings && product.value.routings.length ? product.value.routings.filter(r => !r.is_autocomplete)[0].operation_code : '')
  const selectedRouting = ref(defaultSelectedRouting.value);
  watchEffect(() => {
    if (selectedRouting.value) return;
    selectedRouting.value = defaultSelectedRouting.value
  })
  const productRoutingBoms = ref<ProductRoutingBOM[]>();
  const routingLoading = ref(false)

  watchEffect(async () => {
    if (selectedRouting.value) {
      routingLoading.value = false
      routingLoading.value = true;
      productRoutingBoms.value = await productStore.getProductRoutingBom(
        props.productId,
        {
          routing_link_code: selectedRouting.value,
        },
      );
      routingLoading.value = false
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
    routingLoading,
    defaultSelectedRouting
  };
}

function useAttachments() {
  interface DialogData {
    title?: string;
    description?: string;
  }

  type AttachmentRecord = Partial<
    Record<ProductResourceType, ProductResource[] | undefined>
  >;

  const attachmentDialog = ref(false);
  const attachmentLoading = ref(false);
  const attachments = ref<AttachmentRecord>({});
  const selectedAttachment = ref<DialogData>();
  const selectedAttachmentType = ref<ProductResourceType>("TDI");


  async function fetchAttachments() {
    const promises = productResourceTypes.map(type => productStore.getProductResources(props.productId, type).then(res => ({ type: type, resources: res })))
    const tae = await Promise.all(promises);
    attachments.value = tae.reduce<AttachmentRecord>((acc, cur) => {
      acc[cur.type] = cur.resources
      return acc
    }, {})

    console.log(attachments.value)
  }


  function getAttachmentType(type: ProductResourceType): DialogData {
    switch (type) {
      case "TDI": {
        selectedAttachmentType.value = "TDI";
        return {
          title: "Technical Drawing (TDI)",
          description:
            "Contains all files related to the technical drawings of this item. Clicking any file will take you to a new tab.",
        };
      }
      case "MANUAL": {
        selectedAttachmentType.value = 'MANUAL'
        return {
          title: "Assembly manual",
          description:
            "Contains all files related to the assembly of this item. Clicking any file will take you to a new tab",
        }
      }
      case "PANTONE": {
        selectedAttachmentType.value = "PANTONE";

        return {
          title: "Pantone references",
          description:
            "Contains all files related to the pantone reference of this item. Clicking any file will take you to a new tab.",
        };
      }
      case "TDP": {
        selectedAttachmentType.value = "TDP";
        return {
          title: "Technical drawings (TDP)",
          description:
            "Contains all files related to the technical drawings of this item. Clicking any file will take you to a new tab.",
        };
      }
      default: {
        return {};
      }
    }
  }

  function handleSelectAttachment(type: ProductResourceType) {
    attachmentDialog.value = true;
    selectedAttachment.value = getAttachmentType(type);
  }

  return {
    attachmentDialog,
    attachmentLoading,
    attachments,
    handleSelectAttachment,
    selectedAttachment,
    fetchAttachments,
    selectedAttachmentType,
  };
}

/* INIT */

watchEffect(async () => {
  await fetchProduct(props.productId);
  await fetchAttachments();
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
  <div class="grid gap-4 px-4 lg:grid-cols-2" v-if="product && !loading">
    <Card>
      <ImageCarousel v-if="product?.images" :images="product?.images"></ImageCarousel>
    </Card>

    <ProductDetails v-if="product" :product="product">
      <template #attachment>
        <ProductAttachmentDropdown>
          <ButtonApp size="icon" variant="ghost">
            <Paperclip />
          </ButtonApp>

          <template #content>
            <DropdownMenuItem @click="handleSelectAttachment('TDI')">
              <Axis3D class="mr-2 h-4 w-4" />
              Technical drawings (TDI)
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleSelectAttachment('TDP')">
              <Axis3D class="mr-2 h-4 w-4" />
              Technical drawings (TDP)
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleSelectAttachment('PANTONE')">
              <PaintBucket class="mr-2 h-4 w-4" /> Pantone reference
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleSelectAttachment('MANUAL')">
              <Notebook class="mr-2 h-4 w-4" /> Assembly manual
            </DropdownMenuItem>
          </template>
        </ProductAttachmentDropdown>
      </template>
    </ProductDetails>

    <ProductRouting v-model="selectedRouting" v-if="product?.routings" :routings="product?.routings"
      class="col-span-full">
      <ProductRoutingInfo :routing="routing" v-if="routing" class="mt-4" />

      <ProductRoutingBoms v-if="productRoutingBoms" :product-routing-boms="productRoutingBoms" :loading="routingLoading"
        class="mt-4">
      </ProductRoutingBoms>


      <div class="text-muted-foreground border rounded-md border-dashed text-center p-4 mt-4"
        v-if="!productRoutingBoms && !routingLoading">
        <MousePointerClick class="mx-auto" />
        <p class="text-sm font-medium">
          Click on any routing to view its data
        </p>
      </div>
    </ProductRouting>

    <ProductCustomLabel class="col-span-full" />

    <Teleport to="#overlay">
      <AttachmentDialog v-model="attachmentDialog" :attachments="attachments[selectedAttachmentType]"
        :loading="attachmentLoading" :title="selectedAttachment?.title" :description="selectedAttachment?.description">
      </AttachmentDialog>
    </Teleport>
  </div>
  <IndexSkeleton v-else />
</template>

<style scoped></style>
