<script setup lang="ts">
import { loaderDescriptionKey, type LoaderProps } from '.';
import { computed, provide } from 'vue';
import { LoaderCircle } from 'lucide-vue-next';

const props = defineProps<LoaderProps>()

provide(loaderDescriptionKey, computed(() => props.description))

</script>

<template>
    <div class="rounded-md border border-dashed grid place-content-center text-center">
        <component class="animate-spin mx-auto" :is="icon ? icon : LoaderCircle" />
        <p class="text-sm text-muted-foreground" v-if="description">{{ description }}</p>
        <slot></slot>
    </div>
</template>


<style scoped></style>