<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';

import BomInfo from './BomInfo.vue';
import type { WipTask } from '@/types/wip';

const props = defineProps<{
    task: WipTask
}>()

const dialog = defineModel({ default: false })
</script>

<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent class="max-w-[90%]">
            <DialogHeader>
                <DialogTitle>Bill of Materials</DialogTitle>
                <DialogDescription>View or print BOM</DialogDescription>
            </DialogHeader>
            <Suspense>
                <BomInfo :task="task">

                </BomInfo>
                <template #fallback>
                    loading...
                </template>
            </Suspense>
        </DialogScrollContent>
    </Dialog>
</template>


<style scoped></style>