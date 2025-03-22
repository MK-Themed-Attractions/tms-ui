<script setup lang="ts">
import { inject } from 'vue';
import { emptyResourceIconKey } from '.';


const icon = inject(emptyResourceIconKey)
</script>

<template>
    <component :is="icon">
        <slot />
    </component>
</template>


<style scoped></style>