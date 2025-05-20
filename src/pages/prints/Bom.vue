<script setup lang="ts">
import type { Product, ProductRouting, ProductRoutingBOM } from '@/types/products';
import type { WipTask } from '@/types/wip';
import { useRouteQuery } from '@vueuse/router';
import { onMounted } from 'vue';

const product = useRouteQuery<"", Product>('product', '', {
    transform: (value) => {
        return JSON.parse(value)
    }
})
const boms = useRouteQuery<"", ProductRoutingBOM[]>('boms', "", {
    transform: (value) => {
        return JSON.parse(value)
    }
})

const planCode = useRouteQuery('planCode')

const task = useRouteQuery<"", WipTask>('task', "", {
    transform: (value) => {
        return JSON.parse(value)
    }
})

const routing = useRouteQuery<"", ProductRouting>('routing', "", {
    transform: (value) => {
        return JSON.parse(value)
    }
})

onMounted(() => {

    window.addEventListener('afterprint', (ev) => {
        window.close()
    })

    window.print()

})
</script>
<template>
    <div class="space-y-4 p-2">
        <p>Product</p>
        <ul class="border rounded-md shadow-sm p-4 grid md:grid-cols-2 gap-2">
            <li class="inline-flex flex-col">
                <span class="text-xs text-muted-foreground">SKU</span>
                <span class="font-medium">{{ product?.sku }}</span>
            </li>

            <li class="inline-flex flex-col">
                <span class="text-xs text-muted-foreground">Title</span>
                <span class="font-medium">{{ product?.title }}</span>
            </li>

            <li class="inline-flex flex-col">
                <span class="text-xs text-muted-foreground">Plan Code</span>
                <span class="font-medium">{{ planCode }}</span>
            </li>

            <li class="inline-flex flex-col">
                <span class="text-xs text-muted-foreground">Task UUID</span>
                <span class="font-medium">{{ task?.task_plan_id }}</span>
            </li>

            <li class="inline-flex flex-col">
                <span class="text-xs text-muted-foreground">Process</span>
                <span class="font-medium">{{ routing?.workcenters.name }}</span>
            </li>
            <li class="inline-flex flex-col">
                <span class="text-xs text-muted-foreground">Runtime</span>
                <span class="font-medium">{{ routing?.runtime }}<span class="text-xs text-muted-foreground">mins</span>
                </span>
            </li>
            <li class="inline-flex flex-col">
                <span class="text-xs text-muted-foreground">Manpower</span>
                <span class="font-medium">{{ routing?.manpower }}
                </span>
            </li>
        </ul>

        <p>Materials</p>
        <ul v-if="boms" class="space-y-2">
            <li v-for="bom in boms" :key="bom.no" class="border rounded-md p-2">
                <div class="font-medium">
                    <span>{{ bom.quantity_per }} &nbsp;</span>
                    <span class="text-xs text-muted-foreground ">{{ bom.unit_of_measure_code }} of</span>
                </div>
                <span class="">{{ bom.description }} - {{ bom.no }}</span>

            </li>
        </ul>

    </div>
</template>



<style scoped></style>