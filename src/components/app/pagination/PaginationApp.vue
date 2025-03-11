<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import {
  PaginationButtonsApp,
  PaginationPerPageApp,
  type PaginationAppProps,
  type PaginationQuery,
} from ".";
import { ref, watch, watchEffect, type Ref } from "vue";
import { nextTick } from "vue";

const props = withDefaults(
  defineProps<PaginationAppProps>(),
  {
    pageName: "page",
    perPageName: "per-page",
    defaultPerPage: 30
  },
);
const emits = defineEmits<{
  (e: "change:query", query: Partial<PaginationQuery>): void;
}>();

const perPage = useRouteQuery(props.perPageName, props.defaultPerPage.toString());
const page = useRouteQuery(props.pageName, "1", { transform: Number });

const flag = ref(false)
/* watch for route query 
changes and emit an event */

watch(perPage, async (newValue) => {
  flag.value = true
  page.value = 1;
  await nextTick() //force to wait for this component to update , this means page watcher will not run since it has a guard clause

  emits("change:query", {
    page: page.value,
    perPage: newValue,
  });

  flag.value = false;

});

watch(page, (newValue) => {
  if (flag.value) return;
  emits("change:query", {
    page: newValue,
    perPage: perPage.value,
  });
});
</script>
<template>
  <div class="flex justify-end gap-6">
    <PaginationPerPageApp v-model:pages="perPage" class="flex items-center gap-2"></PaginationPerPageApp>
    <PaginationButtonsApp v-model:page="page" class="flex items-center gap-2" :loading="$attrs['loading'] as boolean"
      :disable-prev="$attrs['disable-prev'] as boolean" :disable-next="$attrs['disable-next'] as boolean">
    </PaginationButtonsApp>
  </div>
</template>

<style scoped></style>
