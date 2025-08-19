<script setup lang="ts">
import { useTicketStore } from '@/stores/ticketStore';
import TicketTypesForm from '../components/TicketTypesForm.vue';
import type { TicketTypeSchema } from '@/types/TicketType';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const ticketStore = useTicketStore()
const { loading, errors } = storeToRefs(ticketStore)
const router = useRouter()
async function handleSubmit(data: TicketTypeSchema) {
    await ticketStore.createTicketType(data)

    if (errors.value) {
        toast.error('Something went wrong', {
            description: errors.value.data.message
        })
        return;
    }

    toast.success('Ticket Type created successfully')
    router.push({ name: 'ticketTypesIndex', query: { submitted: 'true' } })
}
</script>
<template>
    <div>
        <TicketTypesForm @submit="handleSubmit" :loading="loading" />
    </div>
</template>

<style scoped></style>