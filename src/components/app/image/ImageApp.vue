<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, ref } from "vue";
import type { ImageProps } from ".";
const noPhotoImagePath = "/no_photo.png";
const props = withDefaults(defineProps<ImageProps>(), {
  image: noPhotoImagePath,
});

const imageRef = ref<HTMLImageElement | null>(null);

const { stop } = useIntersectionObserver(
  imageRef,
  ([{ isIntersecting }], observerElement) => {
    /* set the image to a proper image when intersected */
    if (isIntersecting) {
      imageRef.value?.setAttribute("src", props.image);
      stop();
    }
  },
  {
    rootMargin: "200px",
  },
);

onMounted(() => {
  if (imageRef) {
    imageRef.value?.addEventListener("error", (e) => {
      const image = e.target as HTMLImageElement;
      image.setAttribute("src", noPhotoImagePath);
    });
  }
});
</script>

<template>
  <img
    ref="imageRef"
    :src="noPhotoImagePath"
    alt="no photo available"
    class="object-contain"
  />
</template>

<style scoped></style>
