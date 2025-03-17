<script setup lang="ts">
import { inject } from 'vue';
import { emptyResourceIconKey } from '.';


const icon = inject(emptyResourceIconKey)
</script>

<template>
    <div>
        <slot>
            {{ icon }}
        </slot>
    </div>
</template>


<style scoped></style>