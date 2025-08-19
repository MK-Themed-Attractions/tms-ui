<script setup lang="ts">
import { Badge, type BadgeVariants } from '@/components/ui/badge';
import type { TicketStatus } from '@/types/ticket';
import { CircleCheck, CircleX, Clock } from 'lucide-vue-next';
import { computed } from 'vue';


const props = defineProps<{
    status: TicketStatus
}>()

const statusVariant = computed<BadgeVariants['variant']>(() => {
    switch (props.status) {
        case 'pending': return 'secondary'
        case 'rejected': return 'destructive'
        default: return 'default'
    }
})

const statusIcon = computed(() => {
    switch (props.status) {
        case 'pending': return Clock
        case 'rejected': return CircleX
        default: return CircleCheck
    }
})
</script>
<template>
    <Badge class="flex items-center gap-1 capitalize" :variant="statusVariant">
        <component :is="statusIcon" class="size-4" /> {{ status }}
    </Badge>
</template>



<style scoped></style>