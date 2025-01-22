<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/types/products";
import { Box, Info, Weight } from "lucide-vue-next";

const props = defineProps<{
  product: Product;
}>();
</script>
<template>
  <Card>
    <CardContent>
      <CardHeader>
        <CardTitle class="flex items-center justify-between text-lg"
          ><span>{{ product.title }}</span>
          <slot name="attachment"> </slot>
        </CardTitle>
        <CardDescription>{{ product.sku }}</CardDescription>
      </CardHeader>

      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2"
      >
        <CardContent
          class="grid grid-cols-[max-content,1fr] gap-2 text-muted-foreground"
        >
          <div class="col-span-full mb-1 flex gap-2">
            <Box :size="18" />
            <p class="text-sm font-medium">Dimensions</p>
          </div>

          <span> Height:</span>
          <span class="font-medium text-primary">
            {{ product.dimension_height }} cm</span
          >

          <span> Length:</span>
          <span class="font-medium text-primary"
            >{{ product.dimension_length }} cm</span
          >

          <span> Width:</span
          ><span class="font-medium text-primary">
            {{ product.dimension_width }} cm</span
          >
        </CardContent>
        <CardContent
          class="grid grid-cols-[max-content,1fr] gap-2 text-muted-foreground"
        >
          <div class="col-span-full mb-1 flex gap-2">
            <Weight :size="18" />
            <p class="text-sm font-medium text-muted-foreground">Weight</p>
          </div>

          <span> Volume:</span>
          <span class="font-medium text-primary">
            {{ product.volume }} cbm</span
          >

          <span> Gross:</span>
          <span class="font-medium text-primary"
            >{{ product.weight_gross }} kg</span
          >

          <span> Net:</span
          ><span class="font-medium text-primary">
            {{ product.weight_net }} kg</span
          >
        </CardContent>

        <CardContent
          class="col-span-full grid grid-cols-[max-content,1fr] gap-2 text-muted-foreground"
        >
          <div class="col-span-full mb-1 flex gap-2">
            <Info :size="18" />
            <p class="text-sm font-medium text-muted-foreground">
              General info
            </p>
          </div>

          <span> Parent code:</span>
          <span class="font-medium text-primary">
            {{ product.parent_code }}</span
          >

          <span> Product BOM no:</span>
          <span class="font-medium text-primary">{{
            product.product_bom_no
          }}</span>

          <span> Routing link code:</span
          ><span class="font-medium text-primary">
            {{ product.routing_link_code }}</span
          >
        </CardContent>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
