<script setup lang="ts">
import { ImageApp } from "@/components/app/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Image } from "@/types/products";
import { Info } from "lucide-vue-next";

const props = defineProps<{
  images: Image[];
}>();
</script>
<template>
  <Carousel
    v-if="images.length"
    class="relative mx-auto w-full max-w-md"
    #default="{ canScrollNext, canScrollPrev }"
  >
    <CarouselContent>
      <CarouselItem v-for="image in images" :key="image.image_link">
        <a
          :href="image.image_link"
          target="_blank"
          class="flex aspect-square items-center justify-center"
        >
          <ImageApp :image="image.thumbnail" class="w-full"> </ImageApp>
        </a>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious class="left-4" v-if="canScrollPrev" />
    <CarouselNext class="right-4" v-if="canScrollNext" />
  </Carousel>
  <div v-else class="grid h-full place-content-center">
    <div class="flex items-center gap-2 text-sm">
      <Info :size="20"/>
      No image available for this product
    </div>
  </div>
</template>

<style scoped></style>
