<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';

const props = defineProps<{
    faded?: boolean
}>()
</script>

<template>
    <div class="flex flex-col gap-4 border rounded-md p-4 relative isolate shadow-sm overflow-hidden">
        <div class="flex gap-4 items-center">
            <Skeleton class="size-14" />
            <div class="space-y-2">
                <Skeleton class="h-2 w-[5rem]" />
                <Skeleton class="h-4 w-[10rem]" />
            </div>
        </div>
        <div class="border rounded-md p-2 flex gap-4 items-center">
            <Skeleton class="size-14" />
            <div class="space-y-2">
                <Skeleton class="h-2 w-[5rem]" />
                <Skeleton class="h-4 w-[10rem]" />
            </div>
            <div class="space-y-2">
                <Skeleton class="h-2 w-[5rem]" />
                <Skeleton class="h-4 w-[10rem]" />
            </div>
            <div class="ml-auto space-y-2">
                <Skeleton class="h-2 w-[5rem] ml-auto" />
                <Skeleton class="h-4 w-[10rem]" />
            </div>
        </div>

        <div class="flex items-center justify-between">
            <Skeleton class="h-4 w-[10rem]" />
            <Skeleton class="h-4 w-[10rem]" />
        </div>

        <div class="border rounded-md p-2 flex gap-4 items-center">
            <Skeleton class="size-14" />
            <div class="space-y-2">
                <Skeleton class="h-2 w-[5rem]" />
                <Skeleton class="h-4 w-[10rem]" />
            </div>
            <div class="space-y-2">
                <Skeleton class="h-2 w-[5rem]" />
                <Skeleton class="h-4 w-[10rem]" />
            </div>
            <div class="ml-auto space-y-2">
                <Skeleton class="h-2 w-[5rem] ml-auto" />
                <Skeleton class="h-4 w-[10rem]" />
            </div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-white  to-transparent" v-if="faded">

        </div>
    </div>
</template>


<style scoped></style>