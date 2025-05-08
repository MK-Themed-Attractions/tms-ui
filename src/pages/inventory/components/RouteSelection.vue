<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { computed, inject, onActivated, onBeforeUnmount, onDeactivated, onUnmounted } from 'vue';
import { inventorySelectedKey } from '../data';

const selectedRoute = defineModel<string>()
const inventorySelected = inject(inventorySelectedKey)

const availableRoutes = computed(() => {
    return new Set(inventorySelected?.value.tasks?.map(t => t.operation_code))
})

onBeforeUnmount(() => selectedRoute.value = undefined)
</script>
<template>
    <ul class="border rounded-md p-4 flex flex-wrap gap-4">
        <li v-for="route in availableRoutes" :key="route" class="inline-flex gap-2 items-center">
            <input type="radio" name="selectedRoute" :id="route" class="size-4 accent-primary" :value="route"
                v-model="selectedRoute">
            <Label :for="route" :class="{ 'text-muted-foreground': selectedRoute !== route }">{{ route }}</Label>
        </li>
    </ul>
</template>


<style scoped></style>