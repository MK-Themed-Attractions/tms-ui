<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { LoaderCircle } from 'lucide-vue-next';
import { inject, useTemplateRef } from 'vue';
import { InfiniteScrollNoContent, triggerFunctionKey } from '.';

const emits = defineEmits<{
    (e: 'trigger', cb: (canAddMore: boolean) => void): void
}>()
const triggerRef = useTemplateRef<HTMLDivElement>('trigger')

/* calls the trigger function on the parent component */
const sendTriggerToParent = inject(triggerFunctionKey)
const { isActive, stop } = useIntersectionObserver(triggerRef, ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
        if (sendTriggerToParent)
            sendTriggerToParent((canAddMore) => {
                if (!canAddMore)
                    stop()
            })
        emits('trigger', (canAddMore) => {
            if (!canAddMore)
                stop()
        })
    }
})
</script>

<template>
    <div ref="trigger">
        <slot v-if="isActive">
            <div class="min-h-[20dvh] grid place-content-center relative">
                <LoaderCircle class="animate-spin" />
            </div>
        </slot>
        <slot name="noContent" v-else>
            <InfiniteScrollNoContent />
        </slot>
    </div>
</template>


<style scoped></style>