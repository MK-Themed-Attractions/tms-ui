<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-vue-next';
import { computed, ref, type Component } from 'vue';
import { ButtonApp } from '../button';


const props = defineProps<{
    enableIcon?: Component
    disableIcon?: Component
}>()
defineOptions({
    inheritAttrs: false
})
const toggler = ref(false)

const type = computed(() => !toggler.value ? 'password' : 'text')

const icon = computed(() => {
    if (!toggler.value) {
        return props.enableIcon ? props.enableIcon : Eye
    } else {
        return props.disableIcon ? props.disableIcon : EyeOff
    }
})
</script>
<template>
    <div class="relative">
        <Input :type="type" v-bind="$attrs" />
        <ButtonApp variant="ghost" size="icon" @click="toggler = !toggler" tabindex="-1"
            class="size-8 absolute right-1 top-1/2 -translate-y-1/2">
            <component :is="icon" />
        </ButtonApp>
    </div>
</template>



<style scoped></style>