<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';
import { type Component } from 'vue';


const props = withDefaults(defineProps<{
    title?: string;
    description?: string;
    icon?: Component
}>(), {
    title: 'No more results',
    description: 'You\'ve reached the end of the list',
})

</script>
<template>
    <div class="rounded-md grid place-content-center text-center">
        <component :is="icon ? icon : Inbox" class="mx-auto" />
        <h5 class="text-2xl font-bold">{{ title }}</h5>
        <p class="text-muted-foreground text-sm">{{ description }}</p>
    </div>
</template>



<style scoped></style>