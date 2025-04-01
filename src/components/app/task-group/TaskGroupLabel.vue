<script setup lang="ts">
import type { TaskGroupLabelProps } from '.';

const props = defineProps<TaskGroupLabelProps>()
</script>
<template>
    <div class="flex flex-col">
        <span class="text-xs text-muted-foreground capitalize">{{ label }}</span>
        <p class="font-medium">
            <slot />
        </p>
    </div>
</template>



<style scoped></style>