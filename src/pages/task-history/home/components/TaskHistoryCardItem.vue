<script setup lang="ts">
import type { TaskHistory } from '@/types/taskHistory';


const props = defineProps<{
    history: TaskHistory
}>()
</script>
<template>
    <div class="space-y-4">
        <slot name="header" :item="history">

        </slot>
        <slot />
    </div>
</template>


<style scoped></style>