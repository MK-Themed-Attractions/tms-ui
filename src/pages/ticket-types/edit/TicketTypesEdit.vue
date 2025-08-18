<script setup lang="ts">
import { useTicketStore } from '@/stores/ticketStore';
import TicketTypesForm from '../components/TicketTypesForm.vue';
import type { TicketTypeSchema, UpdateTicketTypePayload } from '@/types/TicketType';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: string }>()
const ticketStore = useTicketStore()
const { loading, errors } = storeToRefs(ticketStore)
const router = useRouter()

const ticket = await ticketStore.getTicketType(props.id)

async function handleSubmit(data: TicketTypeSchema) {
    await ticketStore.updateTicketType(props.id, data as UpdateTicketTypePayload)

    if (errors.value) {
        toast.error('Something went wrong', {
            description: errors.value.data.message
        })
        return;
    }

    toast.success('Ticket Type updated successfully')
    router.push({ name: 'ticketTypesIndex', query: { submitted: 'true' } })
}
</script>
<template>
    <div>
        <TicketTypesForm @submit="handleSubmit" :loading="loading"
            :initial-values="{ description: ticket?.description, name: ticket?.name }" />
    </div>
</template>

<style scoped></style>