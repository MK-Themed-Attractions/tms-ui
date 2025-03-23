<script setup lang="ts">
import { Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper';
import { Check, Circle, Dot } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const steps = [
    {
        step: 1,
        title: 'Casting',
        description:
            ` Easily review the progress of your tasks with Task History.`,
    },
    {
        step: 2,
        title: 'Assembly',
        description: 'A few details about your company will help us personalize your experience.',
    },
    {
        step: 3,
        title: 'Invite your team',
        description:
            'Start collaborating with your team by inviting them to join your account. You can skip this step and invite them later',
    },
]

</script>
<template>
    <Stepper orientation="vertical" class="flex w-full max-w-xs flex-col justify-start gap-10 mt-4" :default-value="2">
        <StepperItem v-for="step in steps" :key="step.step" v-slot="{ state }"
            class="relative flex w-full items-start gap-6" :step="step.step">
            <StepperSeparator v-if="step.step !== steps[steps.length - 1].step"
                class="absolute left-[18px] top-[38px] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

            <StepperTrigger as-child>
                <Button as="div" :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                    size="icon" class="z-10 rounded-full shrink-0 pointer-events-none"
                    tabindex="-1"
                    :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']">
                    <Check v-if="state === 'completed'" class="size-5" />
                    <Circle v-if="state === 'active'" />
                    <Dot v-if="state === 'inactive'" />
                </Button>
            </StepperTrigger>

            <div class="space-y-1">
                <StepperTitle :class="[state === 'active' && 'text-primary']"
                    class="text-sm font-semibold transition lg:text-base">
                    {{ step.title }}
                </StepperTitle>
                <StepperDescription :class="[state === 'active' && 'text-primary']"
                    class="text-xs text-muted-foreground transition md:not-sr-only lg:text-sm ">
                    {{ step.description }}
                </StepperDescription>
            </div>
        </StepperItem>
    </Stepper>
</template>



<style scoped></style>