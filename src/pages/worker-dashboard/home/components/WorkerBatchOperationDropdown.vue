<script setup lang="ts">

import type { WipTask } from '@/types/wip';
import { Flag, Pause, Play } from 'lucide-vue-next';
import type { TaskOperationType } from '../..';

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';


const props = defineProps<{
    tasks: WipTask[]
}>()

const emits = defineEmits<{
    (e: 'select', mode: TaskOperationType, tasks: WipTask[]): void

}>()

</script>
<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <slot />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-[10rem]">
            <DropdownMenuGroup>
                <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
                <DropdownMenuItem @click="$emit('select', 'start', tasks)">
                    <Play /> Start all Tasks
                </DropdownMenuItem>
                <DropdownMenuItem @click="$emit('select', 'pause', tasks)">
                    <Pause /> Pause all Tasks
                </DropdownMenuItem>
                <DropdownMenuItem @click="$emit('select', 'done', tasks)">
                    <Flag /> Finish all Tasks
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>


<style scoped></style>