<script setup lang="ts">
import type { ButtonProps } from ".";
import { Button, type ButtonVariants } from "@/components/ui/button";

const props = defineProps<ButtonProps>();
</script>
<template>
  <Button class="flex items-center gap-2">
    <component :is="props.prependIcon" v-if="props.prependIcon" />
    <slot />
    <component :is="props.appendIcon" v-if="props.appendIcon" />
  </Button>
</template>

<style scoped></style>
