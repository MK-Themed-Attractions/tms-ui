<script setup lang="ts">
import type { BatchTask } from "@/types/planning";

const props = defineProps<{
  task: BatchTask;
}>();
</script>
<template>
  <pre class="rounded-md border p-3 shadow">{{ task }}</pre>
</template>

<style scoped></style>
