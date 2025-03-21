<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { DialogClose } from '@/components/ui/dialog';

const props = defineProps<{
    onSubmit: (userId: string) => void,
    loading?: boolean,
    userId: string
}>()
</script>
<template>
    <div>
        <p>Are you sure you want to reset password?</p>
        <div class="flex gap-2 mt-4">
            <ButtonApp variant="outline" :loading="loading" @click="onSubmit(userId)">Yes, im sure</ButtonApp>
            <DialogClose as-child>
                <ButtonApp>
                    No
                </ButtonApp>
            </DialogClose>
        </div>
    </div>
</template>



<style scoped></style>