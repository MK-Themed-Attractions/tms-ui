<script setup lang="ts">
import { inject } from 'vue';
import { emptyResourceDescriptionKey } from '.';


const description = inject(emptyResourceDescriptionKey)
</script>
<template>
    <h3 class="text-sm text-muted-foreground">
        <slot>{{ description }}</slot>
    </h3>
</template>


<style scoped></style>