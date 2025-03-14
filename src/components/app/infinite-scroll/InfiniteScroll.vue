<script setup lang="ts">
import { provide } from 'vue';
import { triggerFunctionKey } from '.';

const emits = defineEmits<{
    (e: 'trigger', cb: (canAddMore: boolean) => void): void
}>()

/* called when the InfiniteScrollTrigger component shown on the screen */
function triggerReceived(cb: (canAddMore: boolean) => void) {
    emits('trigger', cb)
}

provide(triggerFunctionKey, triggerReceived)


</script>
<template>
    <div class="flex flex-col gap-10">
        <slot />
    </div>
</template>



<style scoped></style>