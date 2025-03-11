<script setup lang="ts">
import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-vue-next";
import { ButtonApp } from "../button";
import type { PaginationButtonsAppProps } from ".";

const props = defineProps<PaginationButtonsAppProps>();
const page = defineModel<string | number>('page', { default: '1' });
</script>
<template>
  <div>
    <ButtonApp size="icon" class="h-8 w-8" variant="outline" @click="page = '1'">
      <ChevronsLeft />
    </ButtonApp>
    <ButtonApp :disabled="disablePrev || loading" size="icon" class="h-8 w-8" variant="outline"
      @click="page = (+page - 1).toString()">
      <ChevronLeft />
    </ButtonApp>
    <ButtonApp :disabled="disableNext || loading" size="icon" class="h-8 w-8" variant="outline"
      @click="page = (+page + 1).toString()">
      <ChevronRight />
    </ButtonApp>
  </div>
</template>

<style scoped></style>
