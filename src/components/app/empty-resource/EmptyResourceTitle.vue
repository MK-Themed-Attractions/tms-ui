<script setup lang="ts">
import { inject } from 'vue';
import { emptyResourceTitleKey } from '.';


const title = inject(emptyResourceTitleKey)
</script>
<template>
    <h3 class="text-2xl font-bold">
        <slot>{{ title }}</slot>
    </h3>
</template>


<style scoped></style>