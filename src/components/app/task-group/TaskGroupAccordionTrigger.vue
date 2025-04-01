<script setup lang="ts">
import { AccordionTrigger } from '@/components/ui/accordion';


</script>
<template>
    <AccordionTrigger class="py-2 text-sm text-primary/80">
        <slot />
    </AccordionTrigger>
</template>



<style scoped></style>