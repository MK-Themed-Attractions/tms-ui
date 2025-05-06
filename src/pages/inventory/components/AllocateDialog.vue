<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { computed, inject, provide, watch } from 'vue';
import { selectedRoutingKey, wipBatchKey } from '../data';
import AllocateForm from './AllocateForm.vue';
import { Info } from 'lucide-vue-next';

const props = defineProps<{
    taskIds: string[]
}>()

const selectedBatch = inject(wipBatchKey)
const selectedRouting = defineModel<string>('selectedRouting')

const routings = computed(() => {
    if (!selectedBatch) return;
    const routings = selectedBatch.value?.tasks?.map(t => t.operation_code)

    if (routings)
        return new Set(routings)
})

const dialog = defineModel({ default: false })

watch(dialog, (newValue) => {
    if (!newValue) {
        selectedRouting.value = undefined
    }
})

provide(selectedRoutingKey, computed(() => selectedRouting.value))
</script>
<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent @interact-outside="(e) => e.preventDefault()" class="max-w-[50rem]">
            <div class="space-y-4">
                <DialogHeader>
                    <DialogTitle>Allocate Materials</DialogTitle>
                    <DialogDescription>Allocate materials to tasks</DialogDescription>
                </DialogHeader>

                <div class="mt-4">
                    <ul class="border rounded-md p-4 border-dashed flex flex-wrap gap-4 w-fit">
                        <div v-for="route in routings" :key="route" class="flex items-center gap-2">
                            <input type="radio" name="routings" :id="route" class="accent-black"
                                @click="selectedRouting = route" :checked="selectedRouting == route" />
                            <Label :for="route">{{ route }}</Label>
                        </div>

                    </ul>
                </div>


                <div>
                    <AllocateForm v-if="selectedRouting" :task-ids="taskIds" />

                    <div v-else class="text-sm flex items-center gap-2 justify-center">
                        <Info class="size-4 text-muted-foreground" /> Select a route to start allocating
                    </div>
                </div>
            </div>
        </DialogScrollContent>
    </Dialog>
</template>



<style scoped></style>