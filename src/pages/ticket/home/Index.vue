<script setup lang="ts">
import { SectionHeader } from '@/components/app/section-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next';
import TicketCard from './components/TicketCard.vue';
import { useTicketStore } from '@/stores/ticketStore';
import type { GetTicketsQueryParams, Ticket, TicketStatus } from '@/types/ticket';
import type { TicketType } from "@/types/TicketType";
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { computed, onUpdated, ref } from 'vue';
import type { SimplePaginate } from '@/types/pagination';
import { ButtonApp } from '@/components/app/button';
import { storeToRefs } from 'pinia';
import { FilterApp } from '@/components/app/filter';
import { usePermission } from '@/layouts/main/usePermission';
import { useAuthStore } from '@/stores/authStore';

const ticketStore = useTicketStore()
const { loading } = storeToRefs(ticketStore)
const paginatedTickets = ref<SimplePaginate<Ticket>>()
const route = useRoute()
const router = useRouter()
const page = ref(1)
const hasNextPage = computed(() => !!paginatedTickets.value?.next_page_url)
const tickets = ref<Ticket[]>([])
const ticketTypes = ref<TicketType[]>([])
const ticketTypesFilter = ref<string[]>([])
const ticketStatusFilter = ref<TicketStatus[]>([])
const { hasPermission } = usePermission()
const canCreateTicket = hasPermission(import.meta.env.VITE_TICKET_CREATE_KEY)
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const params = computed<Partial<GetTicketsQueryParams>>(() => {

    const params: Partial<GetTicketsQueryParams> = {
        includes: 'ticket_type', page: page.value, type: ticketTypesFilter.value, status: ticketStatusFilter.value,
    }

    const adminKeys = <string[]>JSON.parse(import.meta.env.VITE_SUPERADMIN_IDS);
    if (!adminKeys.includes(user.value.id)) {
        params.user_ids = [user.value.id]
    }


    return params
})

async function fetchTickets() {

    const promises = Array.from({ length: page.value }).map(async (_, index) => {
        return (ticketStore.getTickets({ ...params.value, page: index + 1 }))
    })

    const responses = await Promise.all(promises)
    tickets.value = []
    for (const response of responses) {
        paginatedTickets.value = response?.data
        if (paginatedTickets.value?.data) {
            tickets.value.push(...paginatedTickets.value.data)
        }
    }

}

async function fetchNextTickets() {
    if (hasNextPage.value) {
        page.value += 1
        const res = await ticketStore.getTickets(params.value)
        paginatedTickets.value = res?.data
        if (paginatedTickets.value?.data) {
            tickets.value.push(...paginatedTickets.value.data)
        }
    }
}


if (!tickets.value || !tickets.value.length) {
    await fetchTickets()
}

if (!ticketTypes.value || !ticketTypes.value.length) {
    const res = await ticketStore.getTicketTypes()
    if (res?.data)
        ticketTypes.value = res.data
}

onUpdated(async () => {
    if (route.query.submitted) {
        await router.push({ query: undefined, replace: true })
        await fetchTickets()
    }
})



async function handleTicketTypeSelect(ticketTypes: TicketType[]) {
    ticketTypesFilter.value = ticketTypes.map(t => t.id)
    await fetchTickets()
}

async function handleFilterClear() {
    ticketTypesFilter.value = []
    ticketStatusFilter.value = []

    await fetchTickets()
}

const ticketStatuses: { id: string, name: TicketStatus }[] =
    [{
        id: '1',
        name: 'pending',
    },
    {
        id: '2',
        name: 'approved',
    },
    {
        id: '3',
        name: 'rejected',
    }]

async function handleTicketStatusSelect(ticketStatuses: { id: string, name: TicketStatus }[]) {
    ticketStatusFilter.value = ticketStatuses.map(t => t.name)
    await fetchTickets()
}

</script>
<template>
    <div class="space-y-6">
        <header>
            <div class="flex flex-wrap justify-between gap-4">
                <SectionHeader title="Ticket"
                    description="This section lets you track and manage all the tickets, including create, update, and delete tickets." />
                <Button class="w-full md:w-auto" as-child v-if="canCreateTicket">
                    <RouterLink :to="{ name: 'ticketCreate' }">
                        <Plus /> Create Ticket
                    </RouterLink>
                </Button>
            </div>
        </header>

        <section class="space-x-4">
            <FilterApp :items="ticketTypes" text="Ticket Type" @select="handleTicketTypeSelect"
                @clear-select="handleFilterClear" />
            <FilterApp :items="ticketStatuses" text="Status" @select="handleTicketStatusSelect"
                @clear-select="handleFilterClear" />
        </section>

        <section>
            <h3 class="font-semibold text-lg">Recent Tickets</h3>

            <ul class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <TicketCard v-for="ticket in tickets" :ticket="ticket" :key="ticket.id" />
                <ButtonApp class="w-min col-span-full mx-auto" :disabled="!hasNextPage || loading"
                    @click="fetchNextTickets" :loading="loading">
                    Load
                    More</ButtonApp>
            </ul>
        </section>
    </div>

</template>



<style scoped></style>