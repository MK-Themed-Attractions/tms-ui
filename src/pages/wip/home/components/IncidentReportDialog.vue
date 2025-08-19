<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import { Textarea } from '@/components/ui/textarea';

const emits = defineEmits<{
    (e: 'submit', reason: string): void
}>()
const model = defineModel({ default: false })
const reason = defineModel('reason', { default: '' })

function handleSubmitReport() {
    emits('submit', reason.value)
    model.value = false
}
</script>

<template>
    <Dialog v-model:open="model">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Incident Report</DialogTitle>
                <DialogDescription>Please provide the reason for the incident. Take note that after you submit, the
                    affected task will be on a repair status</DialogDescription>
            </DialogHeader>

            <div>
                <Textarea placeholder="Reason for the incedent" v-model="reason" />
            </div>

            <DialogFooter>
                <Button @click="handleSubmitReport" :disabled="reason.trim() === ''">Submit Report</Button>
                <DialogClose as-child>
                    <Button variant="secondary">Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<style scoped></style>