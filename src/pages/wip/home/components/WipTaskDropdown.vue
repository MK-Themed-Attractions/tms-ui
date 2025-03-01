<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DropdownMenuGroup from '@/components/ui/dropdown-menu/DropdownMenuGroup.vue';


</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <slot name="activator"/>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="min-w-[10rem]">
            <DropdownMenuGroup>
                <slot>
                    <DropdownMenuItem>Assign workers</DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem>Start</DropdownMenuItem>
                    <DropdownMenuItem>Pause</DropdownMenuItem>
                    <DropdownMenuItem>Stop</DropdownMenuItem>
                    <DropdownMenuItem>Finish</DropdownMenuItem>
                </slot>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>


<style scoped></style>