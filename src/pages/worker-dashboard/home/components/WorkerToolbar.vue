<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Filter, XCircle } from 'lucide-vue-next';
import IconContainer from '../../components/IconContainer.vue';
import type { WipTask } from '@/types/wip';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';

const props = defineProps<{
    batch: { [batchId: string]: WipTask[] }
}>()
const emits = defineEmits<{
    (e: 'select', selectedSku: string): void
}>()
const selectedFilter = defineModel<string>()

/* all tasks SKU without grouping by batch*/
const taskSkus = computed(() => {
    const skuSet = new Set<string>();

    for (const batch of Object.values(props.batch)) {
        for (const task of batch) {
            skuSet.add(task.sku);
        }
    }

    return skuSet;
})

function handleSelect(sku: string) {
    selectedFilter.value = sku;
    emits('select', sku)
}
</script>
<template>
    <Card class="p-4 flex gap-4">
        <IconContainer>
            <Filter />
        </IconContainer>
        <div class="flex items-center gap-2 flex-wrap">
            <Badge class="cursor-pointer" v-for="sku in taskSkus" :key="sku"
                :variant="selectedFilter === sku ? 'default' : 'secondary'" @click="handleSelect(sku)">{{ sku }}</Badge>
            <Button class="rounded-full size-6" size="icon" v-if="selectedFilter" @click="selectedFilter = undefined">
                <XCircle />
            </Button>
        </div>
    </Card>
</template>



<style scoped></style>