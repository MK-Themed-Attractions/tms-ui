<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import { formatReadableDate } from '@/lib/utils';
import type { Ticket } from '@/types/ticket';
import TicketCardStatus from './TicketCardStatus.vue';
import TicketCardAction from './TicketCardAction.vue';
import { toast } from 'vue-sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, MessageCircle } from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator';
import { differenceInDays, formatDistanceStrict, parseISO } from 'date-fns'
import { Badge } from '@/components/ui/badge';
import { computed, defineAsyncComponent, ref } from 'vue';
import { Skeleton } from '@/components/ui/skeleton';
const TicketCardCommentList = defineAsyncComponent(() => import('./TicketCardCommentList.vue'))

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

const ticketColor = computed(() => {
    const createdAt = parseISO(props.ticket.created_at)
    const daysOld = differenceInDays(new Date(), createdAt)

    if (daysOld > 30) {
        return 'bg-indigo-400/30 text-indigo-700 hover:bg-indigo-400/50'
    }
    else if (daysOld > 15) {
        return 'bg-red-400/30 text-red-700 hover:bg-red-400/50'
    }
    else if (daysOld > 7) {
        return 'bg-orange-400/30 text-orange-700 hover:bg-orange-400/50'
    }
    else if (daysOld > 5) {
        return 'bg-yellow-400/30 text-yellow-700 hover:bg-yellow-400/50'
    }
    else {
        return 'bg-green-400/30 text-green-700 hover:bg-green-400/50'
    }

})

const showComments = ref(false)

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
                <p class="bg-muted/50 rounded-md p-4 text-sm">{{ ticket.details }}</p>
                <div class="mt-4 flex items-center justify-between gap-4">
                    <p class="text-xs">{{ formatReadableDate(ticket.created_at) }}</p>
                    <Badge class="rounded" :class="ticketColor">{{ formatDistanceStrict(ticket.created_at, new Date(), {
                        addSuffix: true,
                    }) }}
                    </Badge>
                </div>
            </CardContent>
            <CardFooter class="flex-col items-start gap-2 text-sm ">
                <Button size="sm" :variant="showComments ? 'secondary' : 'ghost'" @click="showComments = !showComments">
                    <MessageCircle />
                    <span>Comments </span>
                    <span>{{ ticket.comments_count }}</span>
                </Button>

                <template v-if="showComments">
                    <Suspense timeout="0">
                        <TicketCardCommentList :ticketId="ticket.id" @submit="ticket.comments_count++" />
                        <template #fallback>
                            <Skeleton class="h-[10rem] w-full"></Skeleton>
                        </template>
                    </Suspense>
                </template>
            </CardFooter>
        </Card>
    </li>

</template>



<style scoped></style>