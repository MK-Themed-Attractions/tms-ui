<script setup lang="ts" generic="T extends {id:string|number}">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { TaskGroupAccordionProps } from '.';
import TaskGroupAccordionTrigger from './TaskGroupAccordionTrigger.vue';

const defaultOpen = defineModel({ default: '' })
const props = defineProps<TaskGroupAccordionProps<T[]>>()
</script>

<template>
    <Accordion type="multiple">
        <AccordionItem v-for="item in items" :key="item.id" :value="<string>item.id">
            <slot name="trigger" :item="item">
                <TaskGroupAccordionTrigger>
                    
                </TaskGroupAccordionTrigger>
            </slot>
            <AccordionContent>
                <slot />
            </AccordionContent>
        </AccordionItem>
    </Accordion>
</template>


<style scoped></style>