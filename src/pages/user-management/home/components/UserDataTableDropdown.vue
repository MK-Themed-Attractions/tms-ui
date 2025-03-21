<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { KeyRound, Lock, Paperclip, Pencil, RefreshCcw, UserPlus } from 'lucide-vue-next';
import type { UserDataTableDropdownEvent } from '..';

const emits = defineEmits<{
    (e: 'select', event: UserDataTableDropdownEvent): void
}>()

</script>
<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <slot />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuGroup>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuItem @click="$emit('select', 'edit')">
                    <Pencil />Edit
                </DropdownMenuItem>
                <DropdownMenuItem @click="$emit('select', 'attach-role')">
                    <UserPlus />Attach Role
                </DropdownMenuItem>
                <DropdownMenuItem @click="$emit('select', 'attach-permission')">
                    <KeyRound />Attach direct permissions
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator></DropdownMenuSeparator>

            <DropdownMenuGroup>
                <DropdownMenuLabel>Security</DropdownMenuLabel>
                <DropdownMenuItem @click="$emit('select', 'reset-password')">
                    <Lock /> Reset password
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>



<style scoped></style>