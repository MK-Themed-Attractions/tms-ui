<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const props = defineProps<{
    modelValue?: boolean
}>()
const emits = defineEmits<{
    (e: 'update:modelValue', checked: boolean): void
}>()

const id = Math.random().toString()
</script>

<template>
    <div class="relative text-sm flex gap-4 rounded-md border p-4 hover:bg-muted">
        <Checkbox :checked="modelValue" @update:checked="(checked) => $emit('update:modelValue', checked)" :id="id"
            class="mt-1">
        </Checkbox>
        <div>
            <Label :for="id" class="absolute z-10 inset-0">
                <span class="sr-only">Default to all</span>
            </Label>
            <p class="font-medium relative after:content-['*'] after:text-rose-500">Default to all</p>
            <p class="text-muted-foreground">Checking this will assign it to all departments, making it the default for
                everyone.</p>
        </div>
    </div>

</template>


<style scoped></style>