<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ChevronDown } from "lucide-vue-next";

const props = defineProps<{
  loading?: boolean;
}>();
const emits = defineEmits<{
  (e: "add"): void;
}>();
</script>
<template>
  <div
    class="inline-flex items-center space-x-1 rounded-md bg-primary text-primary-foreground"
  >
    <slot />
    <Separator orientation="vertical" class="h-5 bg-gray-500" />

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <ButtonApp
          :disabled="$attrs['disabled'] || loading"
          class="px-2 shadow-none"
        >
          <ChevronDown class="h-4 w-4 text-primary-foreground" />
        </ButtonApp>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        :side-offset="5"
        class="min-w-[10rem]"
      >
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuGroup>
          <DropdownMenuItem @click="$emit('add')">
            <ArrowRight />
            Proceed add</DropdownMenuItem
          >
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<style scoped></style>
