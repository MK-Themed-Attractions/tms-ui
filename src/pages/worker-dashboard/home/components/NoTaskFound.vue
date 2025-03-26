<script setup lang="ts">
import { Wrench } from 'lucide-vue-next';


</script>
<template>
    <div class="absolute inset-0 grid place-content-center text-center">
        <Wrench class="mx-auto" />
        <h4 class="text-2xl font-bold tracking-wide">No Tasks found</h4>
        <p class="text-muted-foreground text-sm">Start by placing your RFID on the scanner to view your tasks.
        </p>
    </div>
</template>


<style scoped></style>