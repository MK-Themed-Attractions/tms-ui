<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ButtonApp } from '../button';
import { Check, ChevronDown, Search } from 'lucide-vue-next';
import type { InputFilterDropdownData, InputFilterProps, InputFilterSearchData } from '.';


const props = withDefaults(defineProps<InputFilterProps>(), {
    inputPlaceHolder: 'Search...',
    dropdownLabel: 'Search by'
})
const emits = defineEmits<{
    (e: 'submit', searchData: InputFilterSearchData): void,
}>()

const selectedFilter = defineModel<InputFilterDropdownData>('filter')
const search = defineModel<string>('search', { default: '' })

</script>
<template>
    <div class="relative grow items-center">
        <Input id="search" type="text" placeholder="Search..." class="pl-10 pr-[9rem]" v-model="search"
            :disabled="loading || disabled"
            @keydown.enter="$emit('submit', { search: search, filter: selectedFilter })" />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
            <component :is="icon || Search" class="size-5 text-muted-foreground" />
        </span>

        <div class="absolute inset-y-0 right-0 flex max-w-[10rem] items-center gap-2 p-1">
            <Separator orientation="vertical" class="h-5" />
            <DropdownMenu v-if="selectedFilter">
                <DropdownMenuTrigger>
                    <ButtonApp size="sm" variant="ghost" :disabled="disabled">
                        {{ selectedFilter.value }}
                        <ChevronDown class="size-5" />
                    </ButtonApp>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{{ dropdownLabel }}</DropdownMenuLabel>
                        <DropdownMenuItem v-for="dropdown in dropdownData" :key="dropdown.key"
                            @click="selectedFilter = dropdown">
                            <Check class="invisible" :class="{ '!visible': dropdown.key === selectedFilter?.key }" />
                            {{ dropdown.value }}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
</template>



<style scoped></style>