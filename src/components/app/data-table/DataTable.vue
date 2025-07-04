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
import { Skeleton } from "@/components/ui/skeleton";

const props = withDefaults(defineProps<{
  items: T[];
  columns?: DataTableColumns[];
  loading?: boolean;
  loadingRows?: number
  caption?: string;
}>(), {
  loadingRows: 4
});

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

    <TableCaption v-if="caption">
      {{ caption }}
    </TableCaption>

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
      <TableRow v-if="!loading" v-for="item in items" :key="item[Object.keys(item)[0]]"
        @click="emits('navigateTo', item, $router)" class="group">
        <template v-for="(column, colIndex) in selectedColumns" :key="column.key">
          <slot :name="`item.${column.key as string}`" :item="item" :index="colIndex">
            <TableCell> {{ resolveNestedKey(item, column.key) }}</TableCell>
          </slot>
        </template>
      </TableRow>

      <TableEmpty v-if="!items.length && !loading" :colspan="selectedColumns.length">
        <div class="text-center">
          <ImageApp image="/no_file.png" class="mx-auto max-w-5" />
          <span class="font-medium text-muted-foreground">No Data Available</span>
        </div>
      </TableEmpty>
      <TableRow v-if="loading" v-for="(_, index) in loadingRows" :key="index">
        <TableCell v-for="col in selectedColumns.length" :key="col" class="py-3">
          <Skeleton class="max-w-[20rem] h-2" />
        </TableCell>
      </TableRow>
    </TableBody>

    <TableFooter>
      <TableRow>
        <TableCell :colspan="selectedColumns.length" class="bg-background">
          <slot name="footer" :col-span="selectedColumns.length"></slot>
        </TableCell>
      </TableRow>
    </TableFooter>

  </Table>
</template>

<style scoped></style>
