<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { FieldArray, useFieldArray, useForm } from 'vee-validate';
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
import type { WipTask } from '@/types/wip';
import { EmptyResource } from '@/components/app/empty-resource';
import { LoaderCircle, PackageOpen, XIcon } from 'lucide-vue-next';
import { inventoryConsumptionType, type InventoryAllocatedBom, type InventoryPayload } from '@/types/inventory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const props = withDefaults(defineProps<{
    selectedRoute: string;
    mode?: AllocationMode,
}>(), {
    mode: 'add'
})
const emits = defineEmits<{
    (e: 'submitted'): void
}>()
const inventorySelected = inject(inventorySelectedKey)
const fetchBom = inject(fetchBomKey)
const productStore = useProductStore()
const { loading: productLoading } = storeToRefs(productStore)
const productBoms = ref<ProductRoutingBOM[]>()
const inventoryStore = useInventoryStore()
const { errors: inventoryErrors, loading: inventoryLoading } = storeToRefs(inventoryStore)

const bomSchema = z.object({
    production_bom_no: z.string(),
    no: z.string(),
    quantity: z.coerce.number().nonnegative(),
    plan_code: z.string().optional(),
    plan_task_id: z.string().optional(),
    task_id: z.string().optional(),
    id: z.string().optional(),
    type: z.enum(inventoryConsumptionType).default('original')
})
const formSchema = toTypedSchema(z.object({
    consumptions: z.array(bomSchema),
    additionalConsumptions: z.array(bomSchema).optional()
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
                task_id: task.id,
            }
        })
    }).flat()

    if (payload && payload.length) {
        if (props.mode === 'add') {
            await inventoryStore.addInventoryConsumption({
                consumptions: payload
            })

            if (!inventoryErrors.value) {
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
                toast.info('BOM Allocation Info', {
                    description: 'BOM allocation successfully updated'
                })
            } else {
                toast.error('BOM Allocation Error', {
                    description: 'An Error occured while updating BOM Allocation'
                })
            }
        }


        /* Additional BOM logic */
        if (values.additionalConsumptions) {
            const additionalBomPayload = tasksByRoute.value.map(task => {
                return values.additionalConsumptions!.map(con => {
                    return {
                        ...con,
                        plan_task_id: task.task_plan_id,
                        task_id: task.id,
                        plan_code: inventorySelected?.value.plan?.code
                    }
                })
            }).flat()

            const promises = additionalBomPayload.reduce<{
                create: z.infer<typeof bomSchema>[];
                update: z.infer<typeof bomSchema>[];
            }>((acc, cur) => {
                if (!cur.id)
                    acc.create.push(cur)
                else
                    acc.update.push(cur)
                return acc;
            }, {
                create: [],
                update: []
            })

            if (promises.create && promises.create.length)
                await inventoryStore.addInventoryConsumption({
                    consumptions: promises.create
                })

            if (promises.update && promises.update.length)
                await inventoryStore.updateInventoryConsumption({
                    consumptions: promises.update
                })

            if (fetchBom && inventorySelected && inventorySelected.value.batch && inventorySelected.value.plan) {
                await fetchBom(inventorySelected.value.batch)
                emits('submitted')
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

        const [task] = tasksByRoute.value as WipTask[]
        if (!task) return;
        if (props.mode === 'edit') {


            consumptions?.forEach(cons => {
                const existingBomAllocation = inventorySelected.value.batch?.allocated_boms?.find(ab => ab.no === cons.no && ab.task_id === task.id)
                if (existingBomAllocation) {
                    cons.quantity = existingBomAllocation.quantity
                    cons.id = existingBomAllocation.id
                }
            })

            if (fetchBom && inventorySelected && inventorySelected.value.batch && inventorySelected.value.plan)
                await fetchBom(inventorySelected.value.batch)
        }


        const additionalConsumptions = JSON.parse(JSON.stringify(inventorySelected.value.batch?.allocated_boms?.filter(ab => ab.type === 'additional' && ab.task_id === task.id))) as InventoryAllocatedBom[]
        if (additionalConsumptions && additionalConsumptions.length) {
            const bomNos = additionalConsumptions.map(ab => ab.no)

            const res = await productStore.getBoms({
                no: bomNos
            })

            if (res) {
                additionalBoms.value = res;
            }

        }
        setValues({
            consumptions,
            additionalConsumptions
        })
    }
})

const { additionalBomSearch, handleBomSearch, handleRemoveBom, additionalBoms } = useAdditionalBom()

function useAdditionalBom() {
    const { fields: formAdditionalBoms, push: addAdditionalBom, remove: removeAdditionalBom } = useFieldArray<z.infer<typeof bomSchema>>('additionalConsumptions')
    const additionalBomSearch = ref('')
    const additionalBoms = ref<ProductRoutingBOM[]>([])

    const handleBomSearch = async () => {
        if (!additionalBomSearch.value.trim()) return;

        const res = await productStore.getBom(additionalBomSearch.value)

        if (res && additionBomExists(res) || !res) return;

        addAdditionalBom({
            no: res.no,
            quantity: res.quantity_per,
            id: '',
            type: 'additional',
            production_bom_no: res.production_bom_no,
        })
        additionalBoms.value.push(res)
    }


    const additionBomExists = (bom: ProductRoutingBOM) => {
        return formAdditionalBoms.value.some(ab => ab.value.no === bom.no)
    }

    const handleRemoveBom = (bom: ProductRoutingBOM, idx: number) => {
        additionalBoms.value = additionalBoms.value.filter(b => b.no !== bom.no)
        removeAdditionalBom(idx)
    }

    return {
        formAdditionalBoms,
        additionalBoms,
        additionalBomSearch,
        handleBomSearch,
        removeAdditionalBom,
        handleRemoveBom
    }
}
</script>
<template>
    <form @submit.prevent="submit" class="space-y-4 mt-6 relative">
        <ul class="grid lg:grid-cols-2 gap-4 items-end" v-if="productBoms && productBoms.length">
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
        <EmptyResource v-else-if="!productBoms?.length" title="No BOM Found"
            description="Seems like there's no BOM for this route, please contact R&D if you think this is a mistake."
            :icon="PackageOpen" />

        <Card v-if="inventorySelected?.tasks?.length === 1">
            <CardHeader>
                <CardTitle class="text-sm">Additional Boms</CardTitle>
                <CardDescription class="text-xs">Manually add additional Boms</CardDescription>
            </CardHeader>
            <CardContent>
                <Input type="text" placeholder="BOM No" v-model="additionalBomSearch"
                    @keydown.enter.prevent="handleBomSearch" />

                <ul class="grid lg:grid-cols-2 gap-4 items-end">
                    <li v-for="(bom, index) in additionalBoms" :key="bom.no">
                        <FormField #="{ componentField }" :name="`additionalConsumptions[${index}].quantity`">
                            <FormItem>
                                <FormLabel>
                                    <span>{{ bom.description }}</span>
                                </FormLabel>


                                <div class="flex gap-2 items-center">
                                    <div class="relative grow">
                                        <FormControl>
                                            <Input v-bind="componentField" class="pl-10" />
                                        </FormControl>
                                        <p
                                            class="absolute left-2 top-1/2 -translate-y-1/2 font-medium text-xs bg-muted px-1 rounded-sm text-muted-foreground">
                                            Qty</p>
                                        <p
                                            class="absolute right-2 text-xs top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {{
                                                bom.unit_of_measure_code }}
                                        </p>
                                    </div>
                                    <div>
                                        <Button variant="ghost" size="icon" type="button"
                                            class="text-destructive hover:text-destructive hover:bg-destructive/30"
                                            @click="handleRemoveBom(bom, index)">
                                            <XIcon />
                                        </Button>
                                    </div>

                                </div>
                                <FormMessage />
                            </FormItem>

                        </FormField>
                    </li>
                </ul>

            </CardContent>
        </Card>

        <div class="inset-0 absolute grid place-content-center bg-black/5" v-if="productLoading">
            <LoaderCircle class="animate-spin" />
        </div>
        <ButtonApp type="submit" :loading="inventoryLoading">{{ mode === 'add' ? 'Allocate' : 'Update Allocation' }}
        </ButtonApp>
    </form>
</template>



<style scoped></style>