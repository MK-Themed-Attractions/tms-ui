<script setup lang="ts">
import { HardHat, LogOut } from 'lucide-vue-next';
import IconContainer from '../../components/IconContainer.vue';
import type { Worker } from '@/types/workers';
import type { WorkerStats } from '../..';
import { ButtonApp } from '@/components/app/button';

const props = defineProps<{
    worker: Worker
    stats?: Partial<WorkerStats>
}>()
const emits = defineEmits<{
    (e: 'logout'): void
}>()
</script>
<template>
    <div class="border rounded-md p-4 shadow-sm flex gap-4 items-center">
        <IconContainer>
            <HardHat />
        </IconContainer>
        <div class="flex flex-wrap gap-6 grow">
            <div>
                <span class="text-xs text-muted-foreground">ID</span>
                <p class="font-medium">{{ worker.worker_number }}</p>
            </div>
            <div>
                <span class="text-xs text-muted-foreground">Employee</span>
                <p class="font-medium capitalize">{{ worker.full_name }}</p>
            </div>
            <div>
                <span class="text-xs text-muted-foreground">Department</span>
                <p class="font-medium capitalize">{{ worker.department?.name }}</p>
            </div>
            <div>
                <span class="text-xs text-muted-foreground">Points</span>
                <p class="font-medium">1,598</p>
            </div>
            <div class="self-center ml-auto">
                <ButtonApp size="icon" variant="secondary" @click="$emit('logout')">
                    <LogOut />
                </ButtonApp>
            </div>
        </div>
    </div>
</template>



<style scoped></style>