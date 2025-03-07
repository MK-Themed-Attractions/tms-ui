<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ThumbsDown, ThumbsUp } from 'lucide-vue-next';

const popover = defineModel({ default: false })

const emits = defineEmits<{
    (e: 'pass'): void;
    (e: 'fail'): void;
}>()

function handlePass() {
    emits('pass')
    popover.value = false
}
function handleFail() {
    emits('fail')
    popover.value = false
}
</script>
<template>
    <Popover v-model:open="popover">
        <PopoverTrigger @click.stop="">
            <slot />
        </PopoverTrigger>
        <PopoverContent align="end" class="max-w-[20rem] text-sm p-2">
            <p class="font-medium mb-2">Task verdict</p>
            <ul class="space-y-2">
                <li class="border rounded-md p-2 flex gap-2 hover:bg-muted focus-within:bg-muted" role="button"
                    @click.stop="handlePass" tabindex="0">
                    <ThumbsUp />
                    <div>
                        <p>Pass</p>
                        <p class="text-muted-foreground text-xs">Pass and move to the KPI checklist.</p>
                    </div>
                </li>
                <li class="border rounded-md p-2 flex gap-2 hover:bg-muted focus-within:bg-muted" role="button"
                    @click.stop="handleFail" tabindex="0">
                    <ThumbsDown />
                    <div>
                        <p>Fail</p>
                        <p class="text-muted-foreground text-xs">Fail and specify the reasons for failure.</p>
                    </div>
                </li>
            </ul>
        </PopoverContent>
    </Popover>
</template>



<style scoped></style>