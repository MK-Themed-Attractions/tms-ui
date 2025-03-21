<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Flag, Pause, Play } from 'lucide-vue-next';
import type { TaskOperationType } from '../..';
import type { WipTask } from '@/types/wip';
import { useTaskControls } from '@/composables/useTaskControls';

const emits = defineEmits<{
    (e: 'select', type: TaskOperationType, task: WipTask): void
}>()
const props = defineProps<{
    task: WipTask
}>()

const { canStart, canPause, canFinish } = useTaskControls()
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <slot />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
            <DropdownMenuGroup>
                <DropdownMenuLabel>Operations</DropdownMenuLabel>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuItem v-if="canStart(task.status)" @click="$emit('select', 'start', task)">
                    <Play /> Start
                </DropdownMenuItem>
                <DropdownMenuItem v-if="canPause(task.status)" @click="$emit('select', 'pause', task)">
                    <Pause /> Pause
                </DropdownMenuItem>
                <DropdownMenuItem v-if="canFinish(task.status)" @click="$emit('select', 'done', task)">
                    <Flag /> Finish
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>


<style scoped></style>