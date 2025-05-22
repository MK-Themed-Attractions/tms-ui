<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft } from 'lucide-vue-next';


const model = defineModel('show', { default: false })
const showAll = defineModel({ default: false })
</script>
<template>
    <div class="border rounded-md overflow-hidden shadow fixed top-1/2 bg-white flex gap-2 duration-300 group"
        :class="{ 'left-0': model, '-left-32': !model }" @mouseenter="model = true" @mouseleave="model = false">
        <div class="flex items-center gap-1 px-2 py-4">
            <Label for="showAll">Show all</Label>
            <Switch id="showAll" v-model="showAll" />
        </div>
        <div class="bg-primary px-2 py-4">
            <ChevronLeft class="stroke-white group-hover:rotate-[180deg] duration-300" />
        </div>
    </div>
</template>



<style scoped></style>