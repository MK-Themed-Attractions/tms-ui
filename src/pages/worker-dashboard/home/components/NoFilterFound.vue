<script setup lang="ts">
import { Filter, Info } from 'lucide-vue-next';
import IconContainer from '../../components/IconContainer.vue';

</script>

<template>
    <div class="flex rounded border border-dashed p-4 grow basis-full">
        <IconContainer>
            <Filter />
        </IconContainer>

        <div class="grow grid place-content-center">
            <Info class="mx-auto" />
            <p class="text-xs font-medium text-muted-foreground">No tasks to filter</p>
        </div>
    </div>
</template>


<style scoped></style>