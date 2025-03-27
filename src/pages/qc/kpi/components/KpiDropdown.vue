<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pencil, Trash } from 'lucide-vue-next';


const emits = defineEmits<{
    (e: 'edit'): void
    (e: 'delete'): void
}>()
</script>
<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <slot />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            <DropdownMenuGroup>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuItem @click="$emit('edit')">
                    <Pencil />Edit
                </DropdownMenuItem>
                <DropdownMenuItem class="text-destructive" @click="$emit('delete')">
                    <Trash />Delete
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>



<style scoped></style>