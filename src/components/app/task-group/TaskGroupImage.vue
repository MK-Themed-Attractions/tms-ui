<script setup lang="ts">
import { getS3Link } from '@/lib/utils';
import type { TaskGroupImageProps } from '.';
import ImageApp from '../image/ImageApp.vue';

const props = defineProps<TaskGroupImageProps>()
</script>
<template>
    <ImageApp :image="getS3Link(image || '', 'small')" class="size-14 border rounded-md p-2" />
</template>



<style scoped></style>