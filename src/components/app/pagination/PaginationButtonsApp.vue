<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { ButtonApp } from "../button";
import type { PaginationButtonsAppProps } from ".";

const props = defineProps<PaginationButtonsAppProps>();
const page = defineModel({ default: 1 });
</script>
<template>
  <div>
    <ButtonApp
      :disabled="disablePrev"
      size="icon"
      class="h-8 w-8"
      variant="outline"
      @click="page--"
    >
      <ChevronLeft />
    </ButtonApp>
    <ButtonApp
      :disabled="disableNext"
      size="icon"
      class="h-8 w-8"
      variant="outline"
      @click="page++"
    >
      <ChevronRight />
    </ButtonApp>
  </div>
</template>

<style scoped></style>
