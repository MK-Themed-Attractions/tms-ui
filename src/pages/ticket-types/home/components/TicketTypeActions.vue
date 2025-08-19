<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePermission } from '@/layouts/main/usePermission';
import { useTicketStore } from '@/stores/ticketStore';
import type { TicketType } from '@/types/TicketType';
import { LoaderCircle, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const { ticketType } = defineProps<{
    ticketType: TicketType
}>()
const ticketStore = useTicketStore()
const { loading } = storeToRefs(ticketStore)
const router = useRouter()
const dialog = ref(false)
const { hasPermission } = usePermission()
async function handleDelete() {
    dialog.value = false
    await ticketStore.deleteTicketType(ticketType.id)

    router.replace({ name: 'ticketTypesIndex', query: { submitted: 'true' } })
}

const canEdit = hasPermission(import.meta.env.VITE_TICKET_TYPE_UPDATE_KEY)
const canDelete = hasPermission(import.meta.env.VITE_TICKET_TYPE_DELETE_KEY)
</script>


<template>
    <Dialog v-model:open="dialog">
        <DropdownMenu>
            <DropdownMenuTrigger as-child v-if="canEdit || canDelete">
                <Button size="icon" variant="ghost">
                    <MoreVertical v-if="!loading" />
                    <LoaderCircle class="animate-spin" v-else />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem as-child v-if="canEdit">
                        <RouterLink :to="{ name: 'updateTicketType', params: { id: ticketType.id } }">
                            <Pencil /> Edit
                        </RouterLink>
                    </DropdownMenuItem>
                    <DialogTrigger as-child v-if="canDelete">
                        <DropdownMenuItem class="text-destructive focus:text-destructive/90">
                            <Trash2 /> Delete
                        </DropdownMenuItem>
                    </DialogTrigger>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Ticket Type</DialogTitle>
                <DialogDescription>Are you sure you want to delete this ticket type?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose as-child>
                    <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button @click="handleDelete" variant="destructive">Delete</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

</template>



<style scoped></style>