<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ProductRoutingWorkcenter } from "@/types/products";
import { CheckIcon } from "lucide-vue-next";
import type { FieldEntry } from "vee-validate";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    workCenters: ProductRoutingWorkcenter[];
    workCenterDisplayLimit?: number;
  }>(),
  {
    workCenterDisplayLimit: 4,
  },
);

const selectedWorkCenters = defineModel<FieldEntry<string>[]>({ default: [] });

const workCentersWithDisplayLimit = computed(() => {
  return selectedWorkCenters.value.slice(0, props.workCenterDisplayLimit);
});

const emits = defineEmits<{
  (e: "select", workCenter: ProductRoutingWorkcenter): void;
}>();

function handleWorkcenterSelect(workCenter: ProductRoutingWorkcenter) {
  emits("select", workCenter);
}

function filterFunction(list: ProductRoutingWorkcenter[], searchTerm: string) {
  return list.filter((workCenter) => {
    return workCenter.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <ButtonApp
        variant="ghost"
        class="col-span-3 justify-start border border-dashed p-2 font-normal text-muted-foreground"
      >
        <div
          v-for="workCenter in workCentersWithDisplayLimit"
          :key="workCenter.key"
          class="rounded border bg-muted p-1 text-xs"
        >
          {{ workCenter.value }}
        </div>
        <div
          v-if="selectedWorkCenters.length > workCenterDisplayLimit"
          class="rounded border bg-muted p-1 text-xs"
        >
          +
          {{ selectedWorkCenters.length - workCentersWithDisplayLimit.length }}
        </div>
      </ButtonApp>
    </PopoverTrigger>
    <PopoverContent class="w-[20rem] p-0">
      <!-- @vue-ignore -->
      <Command :filter-function="filterFunction">
        <CommandInput placeholder="Search"></CommandInput>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="workCenter in workCenters"
              :key="workCenter.id"
              :value="workCenter"
              class="flex gap-2"
              @click="handleWorkcenterSelect(workCenter)"
            >
              <div
                class="rounded-md border *:stroke-white"
                :class="{
                  'bg-primary':
                    selectedWorkCenters.findIndex(
                      (wc) => wc.value === workCenter.no,
                    ) !== -1,
                }"
              >
                <CheckIcon class="h-4 w-4" />
              </div>
              {{ workCenter.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
