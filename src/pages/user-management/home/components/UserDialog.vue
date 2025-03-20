<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';

const props = withDefaults(defineProps<{
    title?: string;
    description?: string
}>(), {
    title: 'User',
    description: 'User dialog'
})

const dialog = defineModel({ default: false })
</script>
<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent @interact-outside="e => e.preventDefault()">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>{{ description }}</DialogDescription>
            </DialogHeader>

            <slot />
        </DialogScrollContent>
    </Dialog>
</template>



<style scoped></style>