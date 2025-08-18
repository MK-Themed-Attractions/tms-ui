<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import type { TicketType } from '@/types/TicketType';
import TicketTypeActions from './TicketTypeActions.vue';

const { ticketType } = defineProps<{
    ticketType: TicketType
}>()
</script>
<template>
    <Card as-child>
        <li class="p-4">
            <div class="flex justify-between items-center">
                <h3 class="font-medium">{{ ticketType.name }}</h3>
                <TicketTypeActions :ticket-type="ticketType" />
            </div>
            <p class="text-sm text-muted-foreground">{{ ticketType.description }}</p>
        </li>
    </Card>
</template>



<style scoped></style>