<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-vue-next";
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <ButtonApp variant="ghost" size="icon" class="h-6 w-6" @click.stop="">
        <EllipsisVertical />
      </ButtonApp>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <slot />
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
