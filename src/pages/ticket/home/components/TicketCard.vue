<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import { formatReadableDate } from '@/lib/utils';
import type { Ticket } from '@/types/ticket';
import TicketCardStatus from './TicketCardStatus.vue';
import TicketCardAction from './TicketCardAction.vue';
import { toast } from 'vue-sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator';

const props = defineProps<{
    ticket: Ticket
}>()

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(props.ticket.ticket_number);
        toast.success(`Ticket number ${props.ticket.ticket_number} copied to clipboard!`)
    } catch (err) {
        toast.error(`Failed to copy ticket number`)
    }
}

</script>
<template>
    <li class="relative group">
        <Card>
            <div class="flex items-center gap-4 p-2 justify-between">
                <p class="text-muted-foreground font-medium text-sm">Ticket #</p>
                <div class="border  rounded inline-flex items-center p-1">
                    <Input :default-value="ticket.ticket_number" readonly
                        class="border-none h-6 p-0 rounded-tr-none rounded-br-none" />
                    <Button variant="ghost" size="icon" @click="copyToClipboard"
                        class="rounded-tl-none rounded-bl-none size-6">
                        <Copy />
                    </Button>
                </div>
            </div>
            <Separator />
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
                <div class="mt-4 flex items-center justify-between gap-4">
                    <p class="text-xs">{{ formatReadableDate(ticket.created_at) }}</p>

                </div>
            </CardContent>
        </Card>
    </li>

</template>



<style scoped></style>