<script setup lang="ts">
import { Square } from "lucide-vue-next";
import type { TypeProductionTag } from "./types";
const dialog = defineModel({ default: false });
const props = defineProps<TypeProductionTag>();
import { cn } from "@/lib/utils";
import { ref } from "vue";

const fix_work_centers = JSON.parse(
  import.meta.env.VITE_PROD_TAG_FIXED_WC || JSON.stringify(props.work_centers),
) as string[];

const xtimeStamp = ref(
  new Date().toLocaleString(undefined, {
    dateStyle: "medium",
  }),
);
</script>
<template>
  <div
    class="relative !h-[6in] !w-[4in] break-inside-avoid-page place-content-start place-self-center border px-2 text-xs"
  >
    <div class="my-2 grid grid-cols-4 gap-2 rounded-lg border border-black p-2">
      <div class="col-span-4 grid">
        <span
          class="col-span-4 place-self-center rounded-lg border border-black bg-white p-2"
          >Production Tag</span
        >
        <span
          class="absolute col-span-4 place-self-end border-b border-black bg-white p-1 text-lg"
        >
          {{ data_index + 1 }} of {{ data_count }}
        </span>
      </div>

      <span class="text-end">Code</span>
      <span class="font-bold">{{ product_sku }}</span>

      <span class="text-end">Prod Order No</span>
      <span class="font-bold">{{ plan_code }}</span>

      <span class="text-end">Description</span>
      <span class="col-span-3 text-start font-bold uppercase">{{
        product_title
      }}</span>
    </div>
    <div class="w-full">
      <div class="grid grid-cols-4">
        <span class="col-span-2 text-center font-bold">Work Centers</span>
        <span class="col-span-2 text-center font-bold">Quality Control</span>
        <template v-for="(wc, wc_index) in fix_work_centers">
          <div class="col-span-4 grid grid-cols-4 gap-x-1">
            <div
              :class="
                cn(
                  'col-span-2 grid grid-cols-6 border-black p-1',
                  'p-1',
                  'border-x border-black',
                  wc_index == 0 && 'rounded-t-sm border-t',
                  wc_index + 1 == fix_work_centers?.length &&
                    'rounded-b-sm border-b',
                )
              "
            >
              <span class="col-span-3 me-2 place-content-center text-left">{{
                wc
              }}</span>
              <span class="col-span-3 w-full place-content-center border-b border-black"
                >:&nbsp;&nbsp;&nbsp;&nbsp;</span
              >
            </div>
            <div
              :class="
                cn(
                  'col-span-2 grid grid-cols-3',
                  '!m-0 !p-0',
                  'border-x border-black',
                  wc_index == 0 && 'rounded-t-sm border-t',
                  wc_index + 1 == fix_work_centers?.length &&
                    'rounded-b-sm border-b',
                )
              "
            >
              <span
                class="flex place-content-center items-center text-xs"
                v-for="stat in ['Passed', 'Failed', 'Repaired']"
                ><Square :size="10" class="me-0.5" />{{ stat }}</span
              >
            </div>
          </div>
        </template>
      </div>
    </div>
    <span class="absolute bottom-2 left-2 text-xs font-bold text-gray-700">{{
      task_id
    }}</span>
    <small class="absolute bottom-2 right-2 text-xs font-bold text-gray-700">
      <small>
        <small>Date Printed: {{ xtimeStamp }}</small>
      </small>
    </small>
  </div>
</template>
