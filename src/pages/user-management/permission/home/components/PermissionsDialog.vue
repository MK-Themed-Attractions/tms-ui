<script setup lang="ts">
import { CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ref } from 'vue';

const dialog = defineModel({ default: false })
</script>

<template>
    <Dialog v-model:open="dialog">
        <DialogTrigger as-child>
            <slot name="activator" />
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Permission</DialogTitle>
                <CardDescription>Ensure the permission key matches the backend. Do not add if unsure..</CardDescription>
            </DialogHeader>

            <div>
                <slot />
            </div>
        </DialogContent>
    </Dialog>
</template>


<style scoped></style>