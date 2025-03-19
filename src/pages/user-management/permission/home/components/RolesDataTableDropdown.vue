<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import { Ellipsis, Paperclip, Pencil, Trash } from 'lucide-vue-next';

const emits = defineEmits<{
    (e: 'edit'): void
    (e: 'attach'): void
    (e: 'delete'): void
}>()
</script>
<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button size="icon" class="size-6" variant="ghost">
                <Ellipsis />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuGroup>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="$emit('edit')">
                    <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem @click="$emit('attach')">
                    <Paperclip /> Attach permissions
                </DropdownMenuItem>
                <DropdownMenuItem class="text-destructive" @click="$emit('delete')">
                    <Trash /> Delete
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>


<style scoped></style>