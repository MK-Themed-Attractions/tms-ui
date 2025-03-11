<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { computed } from 'vue';
import KPIForm from './KPIForm.vue';
import { useQcStore } from '@/stores/qcStore';
import type { KPI, KPIPayload } from '@/types/qc';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';

const props = withDefaults(defineProps<{
    mode?: 'add' | 'edit'
    kpi?: KPI
}>(), {
    mode: 'add'
})
const emits = defineEmits<{
    (e: 'submit', form: KPIPayload, cb: (res: boolean) => Promise<void>): void;
}>()
const { handleKPISubmit, errors, loading } = useKPI()
const dialog = defineModel({ default: false })
const title = computed(() => props.mode === 'add' ? 'Add KPI' : 'Edit KPI')
const description = computed(() => props.mode === 'add' ? 'Create a new KPI. All fields marked with * are required. Note: Ensure your KPI is written in a positive tone.' : 'Edit this KPI. All fields marked with * are required.  Note: Ensure your KPI is written in a positive tone.')

function useKPI() {
    const qcStore = useQcStore()
    const { errors, loading } = storeToRefs(qcStore)

    async function handleKPISubmit(payload: KPIPayload) {
        emits('submit', payload, async (res: boolean) => {
            if (res) {
                toast.info('KPI info', {
                    description: 'KPI successfully added.'
                })
            } else
                toast.error('KPI error', {
                    description: 'Something went wrong while adding KPI. Try again later'
                })
        })
    }

    return {
        handleKPISubmit,
        errors,
        loading
    }
}
</script>
<template>
    <Dialog v-model:open="dialog">
        <DialogTrigger>
            <slot />
        </DialogTrigger>

        <DialogScrollContent @interact-outside="e => e.preventDefault()">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>{{ description }}</DialogDescription>
            </DialogHeader>

            <KPIForm @submit="handleKPISubmit" :loading="loading" v-bind="mode === 'edit' ? { defaults: kpi } : {}" />
        </DialogScrollContent>
    </Dialog>
</template>



<style scoped></style>