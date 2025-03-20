<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';

const dialog = defineModel({ default: false })
</script>
<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Permission Attachment</DialogTitle>
                <DialogDescription>Attach permissions to this role</DialogDescription>
            </DialogHeader>

            <div>
                <slot />
            </div>
        </DialogScrollContent>
    </Dialog>
</template>



<style scoped></style>