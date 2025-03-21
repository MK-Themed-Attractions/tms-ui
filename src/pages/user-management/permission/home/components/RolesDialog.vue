<script setup lang="ts">
import { CardDescription } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogScrollContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const props = withDefaults(defineProps<{
    title?: string;
    description?: string;
}>(), {
    title: 'Add Role',
    description: 'Create a new role, attach permissions later.'
})
const dialog = defineModel({ default: false })
</script>

<template>
    <Dialog v-model:open="dialog">
        <DialogTrigger as-child>
            <slot name="activator" />
        </DialogTrigger>

        <DialogScrollContent @interact-outside="e => e.preventDefault()">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <CardDescription>{{ description }}</CardDescription>
            </DialogHeader>

            <div>
                <slot />
            </div>
        </DialogScrollContent>
    </Dialog>
</template>


<style scoped></style>