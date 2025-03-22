<script setup lang="ts">
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Stepper, StepperDescription, StepperItem, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import type { TaskHistoryTask } from '@/types/taskHistory';
import { Box, Check, Circle, Dot, FolderOpen } from 'lucide-vue-next';
import TaskHistoryCardHistoryAccordion from './TaskHistoryCardHistoryAccordion.vue';
import { EmptyResource, EmptyResourceIcon } from '@/components/app/empty-resource';


const props = defineProps<{
    task: TaskHistoryTask
}>()
</script>

<template>
    <div>
        <Stepper orientation="vertical" class="flex flex-col items-start" v-if="task.histories.length">
            <StepperItem v-for="(history, index) in task.histories" :key="history.id" :step="index" #="{ state }"
                class="items-start">
                <StepperTrigger as-child>
                    <Button as="div" :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                        size="icon" class="z-10 rounded-full shrink-0 pointer-events-none" tabindex="-1"
                        :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']">
                        <Check v-if="state === 'completed'" class="size-5" />
                        <Circle v-if="state === 'active'" />
                        <Dot v-if="state === 'inactive'" />
                    </Button>
                </StepperTrigger>

                <div>
                    <StepperTitle>{{ history.operation_data.operation_code }}</StepperTitle>
                    <StepperDescription>
                        <TaskHistoryCardHistoryAccordion :contents="history.contents"></TaskHistoryCardHistoryAccordion>
                    </StepperDescription>
                </div>
            </StepperItem>
        </Stepper>
        <EmptyResource class="min-h-12" :icon="FolderOpen" description="This tasks has no history yet" v-else>
            <template #icon>
                <EmptyResourceIcon class="size-4 mx-auto"></EmptyResourceIcon>
            </template>
        </EmptyResource>
    </div>
</template>


<style scoped></style>