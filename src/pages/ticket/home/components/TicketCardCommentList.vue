<script setup lang="ts">
import { useTicketStore } from '@/stores/ticketStore';
import type { CreateCommentPayload, CreateTicketPayload, TicketComment } from '@/types/ticket';
import { ref } from 'vue';
import TicketCardCommentItem from './TicketCardCommentItem.vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const props = defineProps<{
    ticketId: string,
}>()
const emits = defineEmits<{
    (e: 'submit'): void
}>()

const ticketStore = useTicketStore()
const { loading: commentsLoading } = storeToRefs(ticketStore)
const comments = ref<TicketComment[]>([])
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const fetchComments = async () => {
    const res = await ticketStore.getTicket(props.ticketId)
    if (res?.comments) {
        comments.value = res.comments
    }
}

const commentInput = ref('')

const handleComment = async () => {
    const payload: CreateCommentPayload = {
        comment: commentInput.value,
        name: user.value.given_name + ' ' + user.value.last_name,
        ticket_id: props.ticketId
    }
    await ticketStore.createComment(payload)
    commentInput.value = ''
    emits('submit')
    await fetchComments()
}

await fetchComments()
</script>
<template>
    <div class="w-full space-y-4">
        <div class="space-y-1 rounded-lg border">
            <Textarea placeholder="Add a comment..." class="bg-transparent border-none focus:!ring-0"
                v-model="commentInput" />
            <Button size="sm" variant="outline" class="m-2 !mb-2" :disabled="!commentInput.trim() || commentsLoading"
                @click="handleComment">Comment</Button>
        </div>
        <div class="space-y-2">
            <TicketCardCommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
        </div>
    </div>
</template>



<style scoped></style>