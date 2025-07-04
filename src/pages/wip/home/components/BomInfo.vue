<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import type { Product, ProductRoutingBOM } from '@/types/products';
import { storeToRefs } from 'pinia';
import { computed, inject, onMounted, ref, useTemplateRef } from 'vue';
import { bomInfoDataTableColumns, selectedPlanKey } from '../../data';
import type { WipTask } from '@/types/wip';
import { ButtonApp } from '@/components/app/button';
import { DataTable } from '@/components/app/data-table';
import { TableCell } from '@/components/ui/table';
import { usePrint } from '@/composables/usePrint';
const props = defineProps<{
    task: WipTask
    autoPrint?: boolean
}>()

const emit = defineEmits<{
    (e: 'afterprint'): void
}>()
const productStore = useProductStore()
const { errors } = storeToRefs(productStore)
const product = ref<Product>()
const boms = ref<ProductRoutingBOM[]>()
const plan = inject(selectedPlanKey)
const routing = computed(() => product.value?.routings?.find(r => r.operation_code === props.task.operation_code))
const printable = useTemplateRef('printable')

const { print } = usePrint(printable, () => {
    emit('afterprint')
})

try {
    product.value = await productStore.getProduct(props.task.sku, {
        includes: 'routings'
    })
    if (!errors.value) {
        boms.value = await productStore.getProductRoutingBom(props.task.sku, { routing_link_code: props.task.operation_code })
    }



} catch (e) {

}


function printBom() {
    print()
}

onMounted(() => {
    if (props.autoPrint) {
        print()
    }
})


</script>
<template>
    <div>
        <div ref="printable">
            <ul class="border rounded-md shadow-sm p-4 flex flex-col gap-2 md:h-[13rem] md:flex-wrap">
                <li class="inline-flex flex-col">
                    <span class="text-xs text-muted-foreground">SKU</span>
                    <span class="font-medium ">{{ product?.sku }}</span>
                </li>

                <li class="inline-flex flex-col">
                    <span class="text-xs text-muted-foreground">Title</span>
                    <span class="font-medium">{{ product?.title }}</span>
                </li>

                <li class="inline-flex flex-col">
                    <span class="text-xs text-muted-foreground">Plan Code</span>
                    <span class="font-medium">{{ plan?.code }}</span>
                </li>

                <li class="inline-flex flex-col">
                    <span class="text-xs text-muted-foreground">Task UUID</span>
                    <span class="font-medium">{{ task.task_plan_id }}</span>
                </li>

                <li class="inline-flex flex-col">
                    <span class="text-xs text-muted-foreground">Process</span>
                    <span class="font-medium">{{ routing?.workcenters.name }}</span>
                </li>
                <li class="inline-flex flex-col">
                    <span class="text-xs text-muted-foreground">Runtime</span>
                    <span class="font-medium">{{ routing?.runtime }}<span
                            class="text-xs text-muted-foreground">mins</span>
                    </span>
                </li>
                <li class="inline-flex flex-col">
                    <span class="text-xs text-muted-foreground">Manpower</span>
                    <span class="font-medium">{{ routing?.manpower }}
                    </span>
                </li>
            </ul>

            <DataTable v-if="boms" :items="boms" :columns="bomInfoDataTableColumns">
                <template #item.quantity_per="{ item }">
                    <TableCell>
                        <span>{{ item.quantity_per }}</span> <span class="text-xs text-muted-foreground">{{
                            item.unit_of_measure_code }}</span>
                    </TableCell>
                </template>
            </DataTable>
        </div>
        <div class="w-fit">
            <ButtonApp @click="printBom">Print</ButtonApp>
        </div>
    </div>
</template>



<style scoped></style>