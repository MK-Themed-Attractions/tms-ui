<script setup lang="ts">
import { computed, provide } from 'vue';
import { emptyResourceDescriptionKey, emptyResourceIconKey, emptyResourceTitleKey, type EmptyResourceProps } from '.';
import EmptyResourceTitle from './EmptyResourceTitle.vue';
import EmptyResourceDescription from './EmptyResourceDescription.vue';
import EmptyResourceIcon from './EmptyResourceIcon.vue';

const props = defineProps<EmptyResourceProps>()


provide(emptyResourceTitleKey, computed(() => props.title))
provide(emptyResourceDescriptionKey, computed(() => props.description))
provide(emptyResourceIconKey, computed(() => props.icon))


</script>

<template>
    <div class="min-h-[30rem] rounded-md border border-dashed grid place-content-center text-center">
        <EmptyResourceIcon class="mx-auto" v-if="icon">
            <component :is="icon" />
        </EmptyResourceIcon>
        <EmptyResourceTitle v-if="title">{{ props.title }}</EmptyResourceTitle>
        <EmptyResourceDescription v-if="description">{{ props.description }}</EmptyResourceDescription>
        <slot> </slot>
    </div>
</template>



<style scoped></style>