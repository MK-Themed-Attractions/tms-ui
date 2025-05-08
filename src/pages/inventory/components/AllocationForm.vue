<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { FieldArray, useForm } from 'vee-validate';
import { computed, inject, onDeactivated, ref, watch, watchEffect } from 'vue';
import { z } from 'zod';
import { fetchBomKey, inventorySelectedKey, type AllocationMode } from '../data';
import { useProductStore } from '@/stores/productStore';
import type { ProductRoutingBOM } from '@/types/products';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ButtonApp } from '@/components/app/button';
import { useInventoryStore } from '@/stores/inventoryStore';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';

const props = withDefaults(defineProps<{
    selectedRoute: string;
    mode?: AllocationMode,
}>(), {
    mode: 'add'
})

const inventorySelected = inject(inventorySelectedKey)
const fetchBom = inject(fetchBomKey)
const productStore = useProductStore()
const productBoms = ref<ProductRoutingBOM[]>()
const inventoryStore = useInventoryStore()
const { errors: inventoryErrors, loading: inventoryLoading } = storeToRefs(inventoryStore)

const formSchema = toTypedSchema(z.object({
    consumptions: z.array(z.object({
        production_bom_no: z.string(),
        no: z.string(),
        quantity: z.coerce.number().nonnegative(),
        plan_code: z.string().optional(),
        plan_task_id: z.string().optional(),
        task_id: z.string().optional(),
        id: z.string().optional()
    }))
}))

const { handleSubmit, setValues } = useForm({
    validationSchema: formSchema,
})

const tasksByRoute = computed(() => {
    return inventorySelected?.value.tasks?.filter(task => {
        return task.operation_code === props.selectedRoute
    })
})
const submit = handleSubmit(async (values) => {
    if (!tasksByRoute.value) {
        console.warn('no taskByRoute')
        return;
    }
    const payload = tasksByRoute.value.map(task => {
        return values.consumptions.map(con => {
            return {
                ...con,
                plan_task_id: task.task_plan_id,
                task_id: task.id
            }
        })
    }).flat()

    if (payload && payload.length) {
        if (props.mode === 'add') {
            await inventoryStore.addInventoryConsumption({
                consumptions: payload
            })

            if (!inventoryErrors.value) {
                if (fetchBom && inventorySelected && inventorySelected.value.batch && inventorySelected.value.plan)
                    await fetchBom(inventorySelected.value.batch)

                toast.info('BOM Allocation Info', {
                    description: 'BOM successfully allocated'
                })
            } else {
                toast.error('BOM Allocation Error', {
                    description: 'An Error occured while adding BOM Allocation'
                })
            }

        } else if (props.mode === 'edit') {
            await inventoryStore.updateInventoryConsumption({
                consumptions: payload
            })

            if (!inventoryErrors.value) {
                if (fetchBom && inventorySelected && inventorySelected.value.batch && inventorySelected.value.plan)
                    await fetchBom(inventorySelected.value.batch)

                toast.info('BOM Allocation Info', {
                    description: 'BOM allocation successfully updated'
                })
            } else {
                toast.error('BOM Allocation Error', {
                    description: 'An Error occured while updating BOM Allocation'
                })
            }
        }
    }

})

watchEffect(async () => {
    if (inventorySelected && inventorySelected.value.plan) {
        productBoms.value = await productStore.getProductRoutingBom(inventorySelected.value.plan.sku, {
            routing_link_code: props.selectedRoute
        })
        const consumptions = productBoms.value?.map(bom => {
            return {
                production_bom_no: bom.production_bom_no,
                no: bom.no,
                quantity: bom.quantity_per,
                plan_code: inventorySelected?.value.plan?.code,
                id: ''
            }
        })

        if (props.mode === 'edit') {
            consumptions?.forEach(cons => {
                const existingBomAllocation = inventorySelected.value.batch?.allocated_boms?.find(ab => ab.no === cons.no)
                if (existingBomAllocation) {
                    cons.quantity = existingBomAllocation.quantity
                    cons.id = existingBomAllocation.id
                }
            })
        }
        setValues({
            consumptions
        })
    }
})

</script>
<template>
    <form @submit.prevent="submit" class="space-y-4 mt-6">
        <ul class="grid lg:grid-cols-2 gap-4 items-end">
            <li v-for="(bom, index) in productBoms" :key="bom.no">
                <FormField #="{ componentField }" :name="`consumptions[${index}].quantity`">
                    <FormItem>
                        <FormLabel>
                            <span>{{ bom.description }}</span>
                        </FormLabel>

                        <div class="relative">
                            <FormControl>
                                <Input v-bind="componentField" class="pl-10" />
                            </FormControl>
                            <p
                                class="absolute left-2 top-1/2 -translate-y-1/2 font-medium text-xs bg-muted px-1 rounded-sm text-muted-foreground">
                                Qty</p>
                            <p class="absolute right-2 text-xs top-1/2 -translate-y-1/2 text-muted-foreground">{{
                                bom.unit_of_measure_code }}
                            </p>
                        </div>
                        <FormMessage />
                    </FormItem>

                </FormField>
            </li>
        </ul>
        <ButtonApp type="submit" :loading="inventoryLoading">Allocate</ButtonApp>
    </form>
</template>



<style scoped></style>