<script setup lang="ts">
import { LoaderCircle, Search } from "lucide-vue-next";
import { Input } from "@/components/ui/input";

const props = defineProps<{
  loading?: boolean;
}>();
const emits = defineEmits<{
  (e: "submit", search: string): void;
}>();

const search = defineModel({ default: "" });
</script>
<template>
  <form @submit.prevent="$emit('submit', search)">
    <div class="relative">
      <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search products..."
        class="w-full appearance-none bg-background pl-8 shadow-none"
        v-model="search"
      />
      <LoaderCircle
        class="absolute right-2 top-3.5 animate-spin"
        :size="15"
        v-if="loading"
      />
    </div>
  </form>
</template>

<style scoped></style>
