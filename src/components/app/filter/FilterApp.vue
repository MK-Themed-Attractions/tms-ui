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
import { type Component, computed, type Ref, ref, watchEffect } from "vue";
import { ButtonApp } from "../button";
import type { FilterAppGenericObject } from ".";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    items: T[];
    text: string;
    icon?: Component;
    maxSelectedText?: number;
  }>(),
  {
    maxSelectedText: 3,
  }
);
const emits = defineEmits<{
  (e: 'select', selected: T[]): void;
  (e: 'clearSelect'): void;
}>()

const selected = defineModel<T[]>({ default: [] })


// Convert selected items into a Set for fast lookup
const selectedSet = computed(() => {
  return new Set(selected.value.map((item) => item.id))
});

function handleSelect(item: T) {
  const exists = selectedSet.value?.has(item.id);
  selected.value = exists
    ? selected.value.filter((e) => e.id !== item.id)
    : [...selected.value, item];

  emits('select', selected.value)
}

function clearSelected() {
  selected.value = [];

  emits('clearSelect')
}

</script>

<template>
  <Popover>
    <PopoverTrigger>
      <slot name="activator" :items="selected">
        <ButtonApp :prepend-icon="CirclePlus" variant="outline" class="border-dashed">
          {{ text }}
          <template v-if="selected.length">
            <Separator orientation="vertical" />
            <span v-if="selected.length < maxSelectedText" v-for="select in selected" :key="select.id"
              class="rounded bg-muted p-1 text-xs font-normal text-muted-foreground">
              {{ select.name }}
            </span>
            <span v-else class="rounded bg-muted p-1 text-xs font-normal text-muted-foreground">
              {{ selected.length }} selected
            </span>
          </template>
        </ButtonApp>
      </slot>
    </PopoverTrigger>

    <PopoverContent align="start" class="p-0" v-bind="$attrs">
      <!-- @vue-ignore -->
      <Command>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
        <CommandGroup class="max-h-[30rem] overflow-y-auto">
          <CommandItem v-for="item in items" :key="item.id" :value="item" class="gap-2" @click="handleSelect(item)">
            <div v-if="selectedSet" class="rounded-md border *:stroke-white"
              :class="{ 'bg-primary': selectedSet.has(item.id) }">
              <CheckIcon class="h-4 w-4" />
            </div>
            {{ item.name }}
          </CommandItem>
        </CommandGroup>

        <div v-if="selected.length">
          <Separator />
          <ButtonApp variant="ghost" class="w-full rounded-none font-normal" @click="clearSelected">
            Clear filters
          </ButtonApp>
        </div>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
