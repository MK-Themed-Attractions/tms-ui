<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import type { TaskHistoryTask } from '@/types/taskHistory';
import { Check, Circle, Dot, FolderOpen } from 'lucide-vue-next';
import TaskHistoryCardHistoryAccordion from './TaskHistoryCardHistoryAccordion.vue';
import { EmptyResource, EmptyResourceIcon } from '@/components/app/empty-resource';
import type { ProductRoutingWorkCenterType } from '@/types/products';


const props = defineProps<{
    task: TaskHistoryTask
}>()
</script>

<template>
    <div>
        <Stepper orientation="vertical" class="flex flex-col items-start gap-4" v-if="task.histories.length">
            <StepperItem v-for="(history, index) in task.histories" :key="history.id" :step="index" #="{ state }"
                class="items-start relative">
                <StepperSeparator v-if="index !== task.histories.length - 1"
                    class="absolute left-[18px] top-[38px] block h-[100%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

                <StepperTrigger as-child>
                    <Button as="div" :variant="state === 'completed' ? 'default' : 'outline'" size="icon"
                        class="z-10 rounded-full shrink-0 pointer-events-none" tabindex="-1">
                        <Check v-if="state === 'completed'" class="size-5" />
                        <Dot v-if="state !== 'completed'" />
                    </Button>
                </StepperTrigger>

                <div>
                    <StepperTitle>{{ history.operation_data.operation_code }}</StepperTitle>
                    <StepperDescription>
                        <TaskHistoryCardHistoryAccordion
                            :work-center="<ProductRoutingWorkCenterType>history.operation_data.operation_code"
                            :contents="history.contents"></TaskHistoryCardHistoryAccordion>
                    </StepperDescription>
                </div>
            </StepperItem>
        </Stepper>
        <EmptyResource class="!min-h-[4rem]" :icon="FolderOpen" description="This tasks has no history yet" v-else>
            <template #icon>
                <EmptyResourceIcon class="size-4 mx-auto"></EmptyResourceIcon>
            </template>
        </EmptyResource>
    </div>
</template>


<style scoped></style>