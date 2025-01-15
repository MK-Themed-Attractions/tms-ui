<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
import type { ButtonProps } from ".";
import { Button } from "@/components/ui/button";

const props = defineProps<ButtonProps>();
</script>
<template>
  <Button class="flex items-center gap-2" :disabled="loading">
    <component :is="props.prependIcon" v-if="!props.loading" />
    <LoaderCircle v-if="loading" class="animate-spin" />

    <slot />

    <component :is="props.appendIcon" v-if="props.appendIcon" />
  </Button>
</template>

<style scoped></style>
