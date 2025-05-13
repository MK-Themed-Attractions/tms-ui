<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';


</script>
<template>
    <div class="grid lg:grid-cols-2 gap-4">
        <div v-for="(_, index) in 4" :key="index" class="space-y-2">
            <Skeleton class="h-4 w-[10rem]" />
            <Skeleton class="h-10" />
        </div>

    </div>
</template>



<style scoped></style>