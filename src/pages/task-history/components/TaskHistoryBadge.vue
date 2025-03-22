<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import type { Component } from 'vue';

const props = defineProps<{
    icon?: Component
}>()

</script>
<template>
    <Badge variant="secondary" class="gap-2">
        <component v-if="icon" :is="icon" class="size-4 text-muted-foreground" />
        <slot />
    </Badge>
</template>



<style scoped></style>