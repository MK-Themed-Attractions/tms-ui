<script setup lang="ts">
import { useProductStore } from "@/stores/productStore";
import type {
  ProductRoutingBOM,
  ProductQueryParameter,
  ProductAttachment,
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

const props = defineProps<{
  productId: string;
}>();
const productStore = useProductStore();
const { loading } = storeToRefs(productStore);

const { fetchProduct, product } = useProduct();
const { selectedRouting, productRoutingBoms, routing } = useRouting();
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

function useAttachments() {
  type ProductAttachmentType = "technical" | "pantone" | "assembly";
  interface DialogData {
    title?: string;
    description?: string;
  }

  type AttachmentRecord = Partial<
    Record<ProductAttachmentType, ProductAttachment[] | undefined>
  >;

  const attachmentDialog = ref(false);
  const attachmentLoading = ref(false);
  const attachments = ref<AttachmentRecord>({});
  const selectedAttachment = ref<DialogData>();
  const selectedAttachmentType = ref<ProductAttachmentType>("technical");

  function fetchAttachments() {
    productStore
      .getProductTechnicalDrawings(props.productId, (loading) => {
        attachmentLoading.value = loading;
      })
      .then((result) => {
        attachments.value.technical = result;
      });

    productStore
      .getProductPantoneReference(props.productId, (loading) => {
        attachmentLoading.value = loading;
      })
      .then((result) => {
        attachments.value.pantone = result;
      });

    productStore
      .getProductAssemblyManual(props.productId, (loading) => {
        attachmentLoading.value = loading;
      })
      .then((result) => {
        attachments.value.assembly = result;
      });
  }

  function getAttachmentType(type: ProductAttachmentType): DialogData {
    switch (type) {
      case "assembly": {
        selectedAttachmentType.value = "assembly";
        return {
          title: "Assembly manual",
          description:
            "Contains all files related to the assembly of this item. Clicking any file will take you to a new tab.",
        };
      }
      case "pantone": {
        selectedAttachmentType.value = "pantone";

        return {
          title: "Pantone references",
          description:
            "Contains all files related to the pantone reference of this item. Clicking any file will take you to a new tab.",
        };
      }
      case "technical": {
        selectedAttachmentType.value = "technical";

        return {
          title: "Technical drawings",
          description:
            "Contains all files related to the technical drawings of this item. Clicking any file will take you to a new tab.",
        };
      }
      default: {
        return {};
      }
    }
  }

  function handleSelectAttachment(type: ProductAttachmentType) {
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
  fetchAttachments();
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

    <ProductDetails v-if="product" :product="product">
      <template #attachment>
        <ProductAttachmentDropdown>
          <ButtonApp size="icon" variant="ghost">
            <Paperclip />
          </ButtonApp>

          <template #content>
            <DropdownMenuItem @click="handleSelectAttachment('technical')"
              ><Axis3D class="mr-2 h-4 w-4" />
              Technical drawings
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleSelectAttachment('pantone')"
              ><PaintBucket class="mr-2 h-4 w-4" /> Pantone reference
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleSelectAttachment('assembly')"
              ><Notebook class="mr-2 h-4 w-4" /> Assembly manual
            </DropdownMenuItem>
          </template>
        </ProductAttachmentDropdown>
      </template>
    </ProductDetails>

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

    <Teleport to="#overlay">
      <AttachmentDialog
        v-model="attachmentDialog"
        :attachments="attachments[selectedAttachmentType]"
        :loading="attachmentLoading"
        :title="selectedAttachment?.title"
        :description="selectedAttachment?.description"
      ></AttachmentDialog>
    </Teleport>
  </div>
</template>

<style scoped></style>
