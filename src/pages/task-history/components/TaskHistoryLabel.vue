<script setup lang="ts">

const props = defineProps<{
    label?: string;
    description?: string;
}>()
</script>
<template>
    <div>
        <p class="text-xs text-muted-foreground">{{ description }}</p>
        <p class="font-medium text-primary/80">{{ label }}</p>
    </div>
</template>



<style scoped></style>