<script setup lang="ts" generic="T extends { [key: string]: any }">
import { computed } from "vue";
import { type Router } from "vue-router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableColumns } from ".";
import ImageApp from "../image/ImageApp.vue";

const props = defineProps<{
  items: T[];
  columns?: DataTableColumns[];
  loading?: boolean;
}>();

const emits = defineEmits<{
  navigateTo: [item: T, router: Router];
}>();

const resolveNestedKey = (item: T, key: string) => {
  return key.split(".").reduce((obj, keyPart) => obj && obj[keyPart], item);
};

const selectedColumns = computed<DataTableColumns[]>(() => {
  if (props.columns) {
    return props.columns;
  } else
    return Object.keys(props.items[0]).map((key) => {
      return { key, title: key };
    });
});
</script>
<template>
  <Table>
    <slot name="caption">
      <TableCaption><slot></slot></TableCaption>
    </slot>
    <TableHeader>
      <TableRow>
        <template v-for="column in selectedColumns" :key="column.key">
          <slot :name="`header.${column.key}`" :item="column">
            <TableHead>{{ column.title }}</TableHead>
          </slot>
        </template>
      </TableRow>
    </TableHeader>

    <TableBody>
      <TableRow
        v-if="!loading"
        v-for="item in items"
        :key="item[Object.keys(item)[0]]"
        @click="emits('navigateTo', item, $router)"
      >
        <template v-for="column in selectedColumns" :key="column.key">
          <slot :name="`item.${column.key as string}`" :item="item">
            <TableCell> {{ resolveNestedKey(item, column.key) }}</TableCell>
          </slot>
        </template>
      </TableRow>

      <TableEmpty
        v-if="!items.length && !loading"
        :colspan="selectedColumns.length"
      >
        <div class="text-center">
          <ImageApp image="/no_file.png" class="mx-auto max-w-5" />
          <span class="font-medium text-muted-foreground"
            >No Data Available</span
          >
        </div>
      </TableEmpty>
      <TableEmpty v-if="loading" :colspan="selectedColumns.length">
        Loading...
      </TableEmpty>
    </TableBody>

    <TableFooter class="bg-background">
      <slot name="footer" :col-span="selectedColumns.length"></slot>
    </TableFooter>
  </Table>
</template>

<style scoped></style>
