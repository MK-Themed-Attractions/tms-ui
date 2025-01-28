<script setup lang="ts" generic="T extends FilterAppGenericObject">
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
import { Separator } from "@/components/ui/separator";
import { CheckIcon, CirclePlus } from "lucide-vue-next";
import { type Component } from "vue";
import { ButtonApp } from "../button";
import type { FilterAppGenericObject } from ".";

defineOptions({
  inheritAttrs: false,
});
const props = withDefaults(
  defineProps<{
    items: T[];
    text: string;
    icon?: Component;
    maxSelectedText?: number;
  }>(),
  {
    maxSelectedText: 3,
  },
);
const emits = defineEmits<{
  (e: "select", selected: T[]): void;
  (e: "clearSelect", selected: T[]): void;
}>();

const selected = defineModel<T[]>({ default: [] });

function handleSelect(item: T) {
  if (existInSelected(item)) {
    selected.value = selected.value.filter((e) => {
      return e.id !== item.id;
    });
  } else {
    selected.value.push(item);
  }

  /* fire select event */
  emits("select", selected.value);
}

function clearSelected() {
  selected.value = [];

  /* fire clear event */
  emits("clearSelect", selected.value);
}

function existInSelected(item: T) {
  return selected.value.find((e) => {
    return e.id === item.id;
  })
    ? true
    : false;
}
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <slot name="activator" :items="selected">
        <ButtonApp
          :prepend-icon="CirclePlus"
          variant="outline"
          class="border-dashed"
        >
          {{ text }}
          <template v-if="selected.length">
            <Separator orientation="vertical" />
            <span
              v-if="selected.length < maxSelectedText"
              v-for="select in selected"
              :key="select.id"
              class="rounded bg-muted p-1 text-xs font-normal text-muted-foreground"
            >
              {{ select.name }}
            </span>
            <span
              v-else
              class="rounded bg-muted p-1 text-xs font-normal text-muted-foreground"
              >{{ selected.length }} selected</span
            >
          </template>
        </ButtonApp>
      </slot>
    </PopoverTrigger>
    <PopoverContent align="start" class="p-0" v-bind="$attrs">
      <Command>
        <CommandInput placeholder="Search"></CommandInput>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
        <CommandGroup class="max-h-[30rem] overflow-y-auto">
          <CommandItem
            v-for="item in items"
            :value="item.name"
            :key="item.id"
            class="gap-2"
            @click="handleSelect(item)"
          >
            <div
              class="rounded-md border *:stroke-white"
              :class="{ 'bg-primary': existInSelected(item) }"
            >
              <CheckIcon class="h-4 w-4" />
            </div>
            {{ item.name }}
          </CommandItem>
        </CommandGroup>
        <div v-if="selected.length">
          <Separator />
          <ButtonApp
            variant="ghost"
            class="w-full rounded-none font-normal"
            @click="clearSelected"
            >Clear filters</ButtonApp
          >
        </div>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
