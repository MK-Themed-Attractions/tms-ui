<script setup lang="ts">
import { Avatar } from '@/components/ui/avatar';
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue';
import type { TicketComment } from '@/types/ticket';
import { formatDistanceToNow } from 'date-fns';
import { computed } from 'vue';

const props = defineProps<{
    comment: TicketComment
}>()

const userInitials = computed(() => props.comment.name.split(' ').map(name => name[0]).join(''))
</script>
<template>
    <div class="flex gap-4">
        <Avatar>
            <AvatarFallback class="size-4">{{ userInitials }}</AvatarFallback>
        </Avatar>

        <div class="space-y-1">
            <div class="space-x-2">
                <span class="font-medium">{{ comment.name }}</span>
                <span class="text-xs text-muted-foreground">{{ formatDistanceToNow(comment.created_at, {
                    addSuffix: true
                }) }}</span>
            </div>
            <p>{{ comment.comment }}</p>
        </div>
    </div>
</template>



<style scoped></style>