<script setup lang="ts">
import { MultiSelect } from '@/components/app/multi-select/Index';
import { useProductStore } from '@/stores/productStore';
import { storeToRefs } from 'pinia';


const workCenterCodes = defineModel<string[]>({ default: [] })
const productStore = useProductStore()
const { workCenters } = storeToRefs(productStore)


if (!workCenters.value) {
    await productStore.getWorkCenters()
}

</script>

<template>
    <MultiSelect v-if="workCenters" :items="workCenters" v-model="workCenterCodes" return-key="no" value-key="no" 
        placeholder="Select Workcenters...">
    </MultiSelect>
</template>



<style scoped></style>