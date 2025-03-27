<script setup lang="ts" generic="T extends {[key:string]:any}">

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ButtonApp } from '../button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CheckIcon } from 'lucide-vue-next';
import type { MultiSelectProps } from './Index';
import { computed, type ComputedRef, type ModelRef } from 'vue';
import MultiSelectValue from './MultiSelectValue.vue';

const props = withDefaults(defineProps<MultiSelectProps<T>>(), {
    maxDisplayCount: 2,
    idKey: 'id',
    valueKey: 'value',
    placeholder: 'Select items...'
})

const model = defineModel<T[] | string[]>({ default: [] })

function handleSelect(item: T) {
    if (props.returnKey) {
        const typedModel = model as ModelRef<string[]>

        const itemIndex = typedModel.value.find(i => i === item[props.returnKey!])

        if (!itemIndex) {
            typedModel.value = [...typedModel.value, item[props.returnKey]]
        } else {
            typedModel.value = typedModel.value.filter(i => i !== item[props.returnKey!])
        }

        return;
    }

    const typedModel = model as ModelRef<T[]>
    const itemIndex = typedModel.value.find(i => i.id === item[props.idKey])

    if (!itemIndex) {
        /* add item */
        typedModel.value = [...typedModel.value, item]
    } else {
        /* remove item */
        typedModel.value = typedModel.value.filter(i => i.id !== item[props.idKey])
    }


}

function itemExists(item: T) {
    /* for string */
    if (props.returnKey) {
        const typedModel = model as ModelRef<T[]>
        return typedModel.value.findIndex(i => i === item[props.returnKey!]) !== -1
    }
    /* for object */

    const typedModel = model as ModelRef<T[]>
    return typedModel.value.findIndex(i => i.id === item[props.idKey]) !== -1
}

function clearitems() {
    model.value = []
}

/* values that are included in the display */
const includedItems = computed(() => {
    let maxCount = props.maxDisplayCount > model.value.length ? model.value.length : props.maxDisplayCount;
    return model.value.slice(0, maxCount)
})

/* array of values to be displayed*/
const displayValues = computed(() => {

    return includedItems.value.reduce<string[]>((acc, item) => {
        if (typeof item === 'object') {
            /* for items */
            acc.push(item[props.valueKey])
        } else {
            /* for string */
            const typedItems = props.items as T[]
            const itemFound = typedItems.find(i => i[props.returnKey!] === item)
            acc.push(itemFound![props.valueKey])
        }
        return acc;
    }, [])

})
/* excluded items count */
const excludedItemsCount = computed(() => model.value.length - includedItems.value.length)
</script>
<template>
    <Popover>
        <PopoverTrigger as-child>
            <slot v-bind="{ includedItems, displayValues, excludedItemsCount }">
                <MultiSelectValue class="flex gap-2 items-center" v-bind="{ class: $attrs['class'] }">
                    <span v-if="displayValues.length" v-for="value in displayValues" :id="value"
                        class="border rounded px-1 bg-muted">{{ value
                        }}</span>
                    <span v-else>{{ placeholder }}</span>
                    <span v-if="excludedItemsCount" class="border rounded-md px-1 bg-muted">+{{ excludedItemsCount
                        }}</span>
                </MultiSelectValue>
            </slot>
        </PopoverTrigger>

        <PopoverContent>
            <Command>
                <CommandInput placeholder="Search"></CommandInput>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandList>
                    <CommandGroup>
                        <CommandItem v-for="item in items as T[]" :key="item[idKey]"
                            :value="item[valueKey] || item[idKey]" class="flex gap-2" @click="handleSelect(item)">
                            <CheckIcon class="h-4 w-4 invisible" :class="{ '!visible': itemExists(item) }" />
                            {{ item[valueKey] }}
                        </CommandItem>
                    </CommandGroup>

                </CommandList>
                <ButtonApp variant="outline" class="mt-2" @click="clearitems" v-if="model.length">Clear
                    selection</ButtonApp>
            </Command>
        </PopoverContent>
    </Popover>
</template>



<style scoped></style>