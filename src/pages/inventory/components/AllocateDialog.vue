<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';

const dialog = defineModel({ default: false })

</script>


<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent @interact-outside="(e) => e.preventDefault()" class="max-w-[50rem]">
            <DialogHeader>
                <DialogTitle>BOM Allocation</DialogTitle>
                <DialogDescription>BOM consumption allocation management. Please adjust the quantity according to
                    product need</DialogDescription>
            </DialogHeader>

            <div>
                <slot />
            </div>
        </DialogScrollContent>
    </Dialog>
</template>



<style scoped></style>