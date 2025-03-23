<script setup lang="ts">
import { ImageApp } from '@/components/app/image';
import { getS3Link } from '@/lib/utils';
import type { TaskHistory } from '@/types/taskHistory';
import TaskHistoryLabel from '../../components/TaskHistoryLabel.vue';


const props = defineProps<{
    history: TaskHistory
}>()
</script>

<template>
    <div class="border rounded-md p-2 bg-muted/20 flex gap-4 lg:gap-6 flex-wrap ">
        <ImageApp :image="getS3Link(history.product_data.image?.filename || '', 'small')" class="size-10" />
        <TaskHistoryLabel :label="history.plan_data.code" description="code" />
        <TaskHistoryLabel :label="history.product_data.sku" description="sku" />
        <TaskHistoryLabel :label="history.product_data.title" description="name" />
    </div>
</template>

<style scoped></style>