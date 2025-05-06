<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { computed, inject, ref, watchEffect } from 'vue';
import { selectedRoutingKey, wipBatchKey, wipPlanKey } from '../data';
import type { ProductRoutingBOM } from '@/types/products';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ButtonApp } from '@/components/app/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useInventoryStore } from '@/stores/inventoryStore';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { ClipboardMinus } from 'lucide-vue-next';
import { EmptyResource } from '@/components/app/empty-resource';

const props = defineProps<{
    taskIds: string[]
}>()
const productStore = useProductStore()
const { loading: productLoading } = storeToRefs(productStore)
const selectedBatch = inject(wipBatchKey)
const selectedRouting = inject(selectedRoutingKey)
const selectedPlan = inject(wipPlanKey)
const boms = ref<ProductRoutingBOM[]>()
const inventoryStore = useInventoryStore()
const { errors: inventoryErrors, loading: inventoryLoading } = storeToRefs(inventoryStore)

const formSchema = toTypedSchema(z.object({
    boms: z.array(z.object({
        production_bom_no: z.string().nonempty(),
        no: z.string().nonempty(),
        quantity: z.coerce.number().positive(),
        plan_task_id: z.string().optional(),
        plan_code: z.string().nonempty()
    }))
}))

const tasksOnRoute = computed(() => {
    if (!selectedRouting || !selectedBatch || !selectedBatch.value || !selectedRouting.value) return

    const filteredBatchByRouting = selectedBatch.value.tasks?.filter(t => t.operation_code.toLowerCase() === selectedRouting.value?.toLowerCase())
    const filteredBatchByUnassignedBomAllocation = filteredBatchByRouting?.filter(fb => {
        return selectedBatch.value?.allocated_boms?.some(ab => ab.plan_task_id === fb.task_plan_id) === false
    })

    return filteredBatchByUnassignedBomAllocation?.filter(fb => {
        return props.taskIds.includes(fb.task_plan_id)
    })
})

const initialValues = computed(() => {
    return boms.value?.map((bom) => {
        return {
            production_bom_no: bom.production_bom_no,
            no: bom.no,
            plan_task_id: '',
            quantity: 0,
            plan_code: selectedPlan?.value?.code || ''
        }
    })
})

const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema,
})

watchEffect(() => {
    setFieldValue('boms', initialValues.value)
})

const submit = handleSubmit(async (values) => {
    const formValues = values.boms.map(bom => {
        return tasksOnRoute.value?.map(t => {
            return {
                production_bom_no: bom.production_bom_no,
                no: bom.no,
                plan_task_id: t.task_plan_id,
                quantity: bom.quantity,
                plan_code: bom.plan_code
            }
        })
    }).flat()

    await inventoryStore.validateToken()

    const inventoryOperations = formValues.map((payload) => {
        if (!payload) return
        return inventoryStore.addInventoryConsumption(payload)
    })


    await Promise.all(inventoryOperations)

    if (!inventoryErrors.value) {
        toast.info('Inventory Consumption info', {
            description: 'Consumption recorded'
        })
    } else {
        toast.error('Inventory Consumption error', {
            description: 'An error occured while adding inventory consumption'
        })
    }

})


watchEffect(async () => {
    if (selectedRouting && selectedBatch) {
        const sku = selectedBatch.value?.tasks?.[0].sku

        if (sku) {
            const fetchedBoms = await productStore.getProductRoutingBom(sku, {
                routing_link_code: selectedRouting.value
            })

            if (fetchedBoms) {
                boms.value = fetchedBoms
            }
        }

    }
})

</script>

<template>
    <form @submit.prevent="submit" class="space-y-4 mt-4" v-if="boms && boms.length && !productLoading">
        <div v-for="(bom, index) in boms" :key="bom.no">
            <p class="font-medium text-sm">{{ bom.description }}</p>

            <FormField #default="{ componentField }" :name="`boms[${index}].quantity`">
                <FormItem>
                    <FormControl>
                        <FormLabel>Quantity</FormLabel>
                        <div class="relative isolate">
                            <Input v-bind="componentField" />
                            <span class="absolute right-2 text-xs top-1/2 -translate-y-1/2">{{ bom.unit_of_measure_code
                                }}</span>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
        </div>
        <ButtonApp type="submit" :disabled="inventoryLoading" :loading="inventoryLoading">Submit</ButtonApp>
    </form>
    <EmptyResource v-else-if="(!boms || !boms.length) && !productLoading" :icon="ClipboardMinus" title="No BOM Found"
        description="No Bom found for this route, try checking other routes" />
    <Skeleton v-else class="h-[30rem]" />
</template>


<style scoped></style>