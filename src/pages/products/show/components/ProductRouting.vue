<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductRouting } from "@/types/products";
import { Eye, EyeClosed, Info } from "lucide-vue-next";
import { computed, ref } from "vue";

const props = defineProps<{
  routings: ProductRouting[];
}>();

const selectedRouting = defineModel({ default: "" });
const { routingsWithFilter, viewHidden, hiddenCount } = useFilter();

function useFilter() {
  const viewHidden = ref(false);

  const routingsWithFilter = computed(() => {
    if (!viewHidden.value) {
      return props.routings.filter((routing) => {
        return !routing.is_autocomplete;
      });
    } else return props.routings;
  });

  const hiddenCount = computed(() => {
    return !viewHidden.value
      ? props.routings.filter((r) => r.is_autocomplete).length
      : 0;
  });

  return {
    viewHidden,
    routingsWithFilter,
    hiddenCount,
  };
}
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-lg">Routings</CardTitle>
      <CardDescription
        >Product routing based on Business Central data.</CardDescription
      >
    </CardHeader>
    <CardContent>
      <Tabs v-model="selectedRouting">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <TabsList class="flex w-fit flex-wrap">
            <TabsTrigger
              v-if="routingsWithFilter.length"
              v-for="routing in routingsWithFilter"
              :key="routing.id"
              :value="routing.operation_code"
            >
              {{ routing.operation_code }}
            </TabsTrigger>
            <div v-else class="flex items-center gap-2 px-2 text-sm">
              <Info :size="15" />
              No routing available for this product
            </div>
          </TabsList>

          <div>
            <Badge
              variant="secondary"
              role="button"
              class="inline-flex items-center gap-1 text-muted-foreground"
              @click="viewHidden = !viewHidden"
            >
              <template v-if="viewHidden">
                <EyeClosed :size="18" /> remove hidden
              </template>
              <template v-else>
                <Eye :size="18" /> {{ hiddenCount }} hidden
              </template>
            </Badge>
          </div>
        </div>

        <slot></slot>
      </Tabs>
    </CardContent>
  </Card>
</template>

<style scoped></style>
