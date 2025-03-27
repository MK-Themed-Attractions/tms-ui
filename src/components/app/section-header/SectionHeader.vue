<script setup lang="ts">
import type { SectionHeaderProps } from '.';
import SectionHeaderDescription from './SectionHeaderDescription.vue';
import SectionHeaderTitle from './SectionHeaderTitle.vue';

const props = defineProps<SectionHeaderProps>()

</script>

<template>
    <div>
        <slot>
            <slot name="title">
                <SectionHeaderTitle>{{ title }}</SectionHeaderTitle>
            </slot>

            <slot name="description">
                <SectionHeaderDescription>{{ description }}</SectionHeaderDescription>
            </slot>
        </slot>
    </div>
</template>



<style scoped></style>