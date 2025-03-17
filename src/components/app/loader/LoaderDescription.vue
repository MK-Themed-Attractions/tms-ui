<script setup lang="ts">
import { inject } from 'vue';
import { loaderDescriptionKey } from '.';


const description = inject(loaderDescriptionKey)
</script>
<template>
    <p class="text-sm text-muted-foreground">
        <slot>{{ description }}</slot>
    </p>
</template>


<style scoped></style>