<template>
    <div class="border border-dashed rounded-md grow flex p-4 items-center gap-4">
        <IconContainer>
            <HardHat />
        </IconContainer>
        <div class="text-center grow">
            <Info class="mx-auto" />
            <h3 class="text-muted-foreground text-xs font-medium">No worker found</h3>
        </div>
    </div>
</template>

<script setup lang="ts">
import { HardHat, Info } from 'lucide-vue-next';
import IconContainer from '../../components/IconContainer.vue';


</script>

<style scoped></style>