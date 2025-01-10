<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, WifiOff } from "lucide-vue-next";
</script>

<template>
  <div class="flex justify-between rounded-md bg-primary-foreground p-1">
    <div class="flex w-[clamp(20rem,50vw,30rem)] items-center gap-2">
      <Input placeholder="Search workers..." />
      <ButtonApp variant="outline" :prepend-icon="Search">Search </ButtonApp>
    </div>

    <div class="flex gap-2">
      <ButtonApp :prepend-icon="Plus">Add worker</ButtonApp>
      <ButtonApp variant="outline" :prepend-icon="WifiOff"
        >Deactivate RFID</ButtonApp
      >
    </div>
  </div>
</template>

<style scoped></style>
