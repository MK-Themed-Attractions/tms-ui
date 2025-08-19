<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePermission } from '@/layouts/main/usePermission';
import { useAuthStore } from '@/stores/authStore';
import { useTicketStore } from '@/stores/ticketStore';
import type { Ticket } from '@/types/ticket';
import { LoaderCircle, MoreVertical, Pencil, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { RouterLink, useRouter } from 'vue-router';

const props = defineProps<{ class?: string, ticket: Ticket }>()
defineOptions({ inheritAttrs: false })
const router = useRouter()
const ticketStore = useTicketStore()
const { loading } = storeToRefs(ticketStore)
const { hasPermission } = usePermission()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)


async function handleApprove() {
    await ticketStore.changeTicketStatus(props.ticket.id, 'approved')
    router.replace({ name: 'ticketIndex', query: { submitted: 'true' } })
}
async function handleReject() {
    await ticketStore.changeTicketStatus(props.ticket.id, 'rejected')
    router.replace({ name: 'ticketIndex', query: { submitted: 'true' } })
}

async function handleDelete() {
    await ticketStore.deleteTicket(props.ticket.id)
    router.replace({ name: 'ticketIndex', query: { submitted: 'true' } })
}

const canChangeStatus = hasPermission(import.meta.env.VITE_TICKET_CHANGE_STATUS_KEY)

</script>
<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" :class="class">
                <MoreVertical v-if="!loading" />
                <LoaderCircle class="animate-spin" v-else />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
                <DropdownMenuItem as-child v-if="user.id === ticket.user_id">
                    <RouterLink :to="{ name: 'updateTicket', params: { id: props.ticket.id } }">
                        <Pencil /> Edit

                    </RouterLink>
                </DropdownMenuItem>
                <DropdownMenuItem @select="handleDelete">
                    <Trash2 /> Delete
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <template v-if="canChangeStatus">
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuItem @select="handleApprove" v-if="ticket.status !== 'approved'">
                    <ThumbsUp /> Approve
                </DropdownMenuItem>
                <DropdownMenuItem @select="handleReject" v-if="ticket.status !== 'rejected'">
                    <ThumbsDown />
                    Reject
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>



<style scoped></style>