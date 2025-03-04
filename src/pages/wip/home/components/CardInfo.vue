<script setup lang="ts">
import { ImageApp } from '@/components/app/image';

const props = defineProps<{
    label?: string;
    image?: string;
}>()
</script>
<template>
    <div class="flex items-center gap-2">
        <div class="size-16 bg-muted rounded-md " v-if="image">
            <ImageApp :image="image" class="max-w-full max-h-full" />
        </div>
        <div>
            <p class="font-medium"><slot /></p>
            <span class="text-sm text-muted-foreground">{{ label }}</span>
        </div>
    </div>
</template>



<style scoped></style>