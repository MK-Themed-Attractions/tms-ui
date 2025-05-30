<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';

import BomInfo from './BomInfo.vue';
import type { WipTask } from '@/types/wip';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableLoader } from '@/components/app/data-table';

const props = defineProps<{
    task: WipTask
    autoPrint?: boolean
}>()

const dialog = defineModel({ default: false })

function closeDialogAfterPrint() {
    if (props.autoPrint) {
        dialog.value = false
    }
}
</script>

<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent class="max-w-[90%]">
            <DialogHeader>
                <DialogTitle>Bill of Materials</DialogTitle>
                <DialogDescription>View or print BOM</DialogDescription>
            </DialogHeader>
            <Suspense>
                <BomInfo :task="task" :auto-print="autoPrint" @afterprint="closeDialogAfterPrint">

                </BomInfo>
                <template #fallback>
                    <div>
                        <Skeleton class="h-[13rem]" />
                        <DataTableLoader />
                    </div>
                </template>
            </Suspense>
        </DialogScrollContent>
    </Dialog>
</template>


<style scoped></style>