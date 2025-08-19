<script setup lang="ts">
import type { TicketSchema, UpdateTicketPayload } from '@/types/ticket';
import TicketForm from '../components/TicketForm.vue';
import { useTicketStore } from '@/stores/ticketStore';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: string }>()
const ticketStore = useTicketStore()
const { loading, errors } = storeToRefs(ticketStore)
const router = useRouter()

const ticket = await ticketStore.getTicket(props.id)

async function handleSubmit(data: TicketSchema) {
    await ticketStore.updateTicket(props.id, data as UpdateTicketPayload)

    if (errors.value) {
        toast.error('Something went wrong', {
            description: errors.value.data.message
        })
        return
    }

    toast.success('Ticket updated successfully')
    router.push({ name: 'ticketIndex', query: { submitted: 'true' } })
}

</script>

<template>
    <div class="max-w-lg mx-auto">
        <TicketForm @submit="handleSubmit" :loading="loading"
            :initial-values="{ details: ticket?.details, title: ticket?.title, ticket_type_id: ticket?.ticket_type_id }" />
    </div>
</template>


<style scoped></style>