<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { Card } from '@/components/ui/card';
import type { WipTask } from '@/types/wip';
import { Flag, Pause, Play } from 'lucide-vue-next';
import type { TaskOperationType } from '../..';
import { ImageApp } from '@/components/app/image';
import { computed } from 'vue';
import { getS3Link } from '@/lib/utils';


const props = defineProps<{
    tasks: WipTask[]
}>()

const emits = defineEmits<{
    (e: 'select', mode: TaskOperationType, tasks: WipTask[]): void

}>()

const firstTask = computed(() => props.tasks[0])
</script>
<template>
    <Card class="shadow-none p-2 text-xs bg-muted/20 flex flex-wrap items-center gap-2 justify-between">
        <ImageApp :image="getS3Link(firstTask.product_data?.image?.filename || '', 'small')" class="size-20" />

        <div>
            <p class="text-center text-muted-foreground">Batch operations</p>
            <div class="flex flex-wrap gap-2">
                <ButtonApp variant="ghost" size="icon" @click="$emit('select', 'start', tasks)">
                    <Play />
                </ButtonApp>
                <ButtonApp variant="ghost" size="icon" @click="$emit('select', 'pause', tasks)">
                    <Pause />
                </ButtonApp>
                <ButtonApp variant="ghost" size="icon" @click="$emit('select', 'done', tasks)">
                    <Flag />
                </ButtonApp>
            </div>

        </div>
    </Card>
</template>



<style scoped></style>