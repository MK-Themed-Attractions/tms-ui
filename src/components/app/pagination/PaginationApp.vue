<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import {
  PaginationButtonsApp,
  PaginationPerPageApp,
  type PaginationAppProps,
  type PaginationQuery,
} from ".";
import { watch, watchEffect } from "vue";

const props = withDefaults(defineProps<PaginationAppProps>(), {
  pageName: "page",
  perPageName: "per-page",
});
const emits = defineEmits<{
  (e: "change:query", query: Partial<PaginationQuery>): void;
}>();

const perPage = useRouteQuery(props.perPageName, "30");
const page = useRouteQuery(props.pageName, 1, { transform: Number });

/* watch for route query 
changes and emit an event */

watch(perPage, (newValue) => {
  emits("change:query", {
    page: page.value,
    perPage: newValue,
  });
});
watch(page, (newValue) => {
  emits("change:query", {
    page: newValue,
    perPage: perPage.value,
  });
});
</script>
<template>
  <div class="flex justify-end gap-6">
    <PaginationPerPageApp
      v-model="perPage"
      class="flex items-center gap-2"
    ></PaginationPerPageApp>
    <PaginationButtonsApp
      v-model="page"
      class="flex items-center gap-2"
      :disable-prev="$attrs['disable-prev'] as boolean"
      :disable-next="$attrs['disable-next'] as boolean"
    ></PaginationButtonsApp>
  </div>
</template>

<style scoped></style>
