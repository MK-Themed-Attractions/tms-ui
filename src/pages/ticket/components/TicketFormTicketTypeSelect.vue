<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTicketStore } from '@/stores/ticketStore';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const ticketStore = useTicketStore()
const { ticketTypes } = storeToRefs(ticketStore)

if (!ticketTypes.value)
    await ticketStore.getTicketTypes()

const model = defineModel<string>({ default: '' })


watch(ticketTypes, () => {
    if (ticketTypes.value && !model.value) model.value = ticketTypes.value[0].id
}, {
    immediate: true
}
)
</script>
<template>
    <Select v-model="model" :default-value="ticketTypes?.[0].id">
        <SelectTrigger>
            <SelectValue placeholder="Select a ticket type"></SelectValue>
        </SelectTrigger>

        <SelectContent>
            <SelectGroup>
                <SelectItem v-for="ticketType in ticketTypes" :key="ticketType.id" :value="ticketType.id">{{
                    ticketType.name }}</SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>



<style scoped></style>