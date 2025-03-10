<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { computed } from 'vue';
import KPIForm from './KPIForm.vue';
import { useQcStore } from '@/stores/qcStore';
import type { KPIPayload } from '@/types/qc';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { useRoute } from 'vue-router';

const props = withDefaults(defineProps<{
    mode?: 'add' | 'edit'
}>(), {
    mode: 'add'
})
const { handleKPISubmit, errors, loading } = useKPI()
const dialog = defineModel({ default: false })
const title = computed(() => props.mode === 'add' ? 'Add KPI' : 'Edit KPI')
const description = computed(() => props.mode === 'add' ? 'Create new KPI, all fields with * are required' : 'Edit this KPI, all fields with * are required.')
const route = useRoute()
function useKPI() {
    const qcStore = useQcStore()
    const { errors, loading } = storeToRefs(qcStore)

    async function handleKPISubmit(payload: KPIPayload) {
        await qcStore.addKpi(payload)


        if (!errors.value) {
            toast.info('KPI info', {
                description: 'KPI successfully added.'
            })
            console.log(route.query)
            await qcStore.getKPIs(
                route.query
            )
        } else
            toast.error('KPI error', {
                description: 'Something went wrong while adding KPI. Try again later'
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

            <KPIForm @submit="handleKPISubmit" :loading="loading" />
        </DialogScrollContent>
    </Dialog>
</template>



<style scoped></style>