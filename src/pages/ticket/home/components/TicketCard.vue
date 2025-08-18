<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import { formatReadableDate } from '@/lib/utils';
import type { Ticket } from '@/types/ticket';
import TicketCardStatus from './TicketCardStatus.vue';
import TicketCardAction from './TicketCardAction.vue';

const props = defineProps<{
    ticket: Ticket
}>()

</script>
<template>
    <li class="relative group">
        <Card>
            <CardHeader class="flex flex-row justify-between">
                <div class="space-y-1.5">
                    <CardTitle class="text-base capitalize">{{ ticket.title }}</CardTitle>
                    <CardDescription>{{ ticket.ticket_type?.name || '-' }}</CardDescription>

                </div>
                <div class="flex items-start gap-1">
                    <TicketCardStatus :status="ticket.status" />
                    <TicketCardAction class="size-5" :ticket="ticket" />

                </div>
            </CardHeader>

            <CardContent class="text-muted-foreground">
                <p>{{ ticket.details }}</p>
                <p class="text-end text-xs mt-4">{{ formatReadableDate(ticket.created_at) }}</p>
            </CardContent>
        </Card>
    </li>

</template>



<style scoped></style>