<script setup lang="ts">
import type { CreateTicketPayload, TicketSchema } from '@/types/ticket';
import TicketForm from '../components/TicketForm.vue';
import { useTicketStore } from '@/stores/ticketStore';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const ticketStore = useTicketStore()
const { loading, errors } = storeToRefs(ticketStore)
const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

async function handleSubmit(data: TicketSchema) {
    await ticketStore.createTicket(data as CreateTicketPayload)

    if (errors.value) {
        toast.error('Something went wrong', {
            description: errors.value.data.message
        })
        return
    }

    toast.success('Ticket created successfully')
    router.push({ name: 'ticketIndex', query: { submitted: 'true' } })
}

</script>

<template>
    <div class="max-w-lg mx-auto">
        <TicketForm @submit="handleSubmit" :loading="loading" :initial-values="{ user_id: user.id }" />
    </div>
</template>


<style scoped></style>