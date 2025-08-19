<script setup lang="ts">
import { SectionHeader } from '@/components/app/section-header';
import { Button } from '@/components/ui/button';
import { useTicketStore } from '@/stores/ticketStore';
import type { TicketType } from '@/types/TicketType';
import { Plus } from 'lucide-vue-next';
import TicketTypeCard from './components/TicketTypeCard.vue';
import { onUpdated, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePermission } from '@/layouts/main/usePermission';

const ticketStore = useTicketStore()
const ticketTypes = ref<TicketType[]>()
const route = useRoute()
const router = useRouter()
const { hasPermission } = usePermission()
const canCreate = hasPermission(import.meta.env.VITE_TICKET_TYPE_CREATE_KEY)

async function fetchTicketTypes() {
    const res = await ticketStore.getTicketTypes()
    ticketTypes.value = res?.data
}

if (!ticketTypes.value) {
    await fetchTicketTypes()
}

onUpdated(async () => {
    if (route.query.submitted) {
        await router.push({ query: undefined, replace: true })
        await fetchTicketTypes()
    }
})


</script>
<template>
    <div class="space-y-6">
        <div class="flex justify-between gap-4 items-center">
            <SectionHeader title="Ticket Types"
                description="Create, Read, Update, and Delete (CRUD) operations for Ticket Types." />

            <Button as-child v-if="canCreate">
                <RouterLink :to="{ name: 'ticketTypesCreate' }">
                    <Plus /> Create Ticket Type
                </RouterLink>
            </Button>
        </div>

        <section>
            <ul class="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
                <TicketTypeCard v-for="ticketType in ticketTypes" :key="ticketType.id" :ticket-type="ticketType" />
            </ul>
        </section>
    </div>
</template>



<style scoped></style>