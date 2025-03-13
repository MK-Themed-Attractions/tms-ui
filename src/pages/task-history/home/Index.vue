<script setup lang="ts">
import { InputFilter } from '@/components/app/input-filter';
import { ref } from 'vue';
import { inputFilterData } from '.';
import TaskStepper from '../components/TaskStepper.vue';
import { Search } from 'lucide-vue-next';

import { useRouteQuery } from '@vueuse/router';


const inputFilter = ref(inputFilterData[0])
const search = useRouteQuery<string>('q')

</script>
<template>
    <div class="container space-y-6">
        <div>
            <h1 class="text-lg font-semibold md:text-2xl">Task History</h1>
            <p class="text-muted-foreground text-sm">
                Track your task progress with Task History. View past assignments, department transitions, and completed
                work for transparency and efficiency.
            </p>
        </div>


        <div class="rounded-md border p-4 shadow-sm space-y-4">
            <div class="max-w-md">
                <InputFilter :dropdown-data="inputFilterData" v-model:filter="inputFilter" v-model:search="search" />
                <p class="text-xs text-muted-foreground mt-2">View more search options by selecting the dropdown arrow
                    on the right side of the search input.
                </p>
            </div>

            <div v-if="true" class="border border-dashed rounded-md min-h-[50vh] grid place-content-center text-center">
                <Search class="mx-auto" />
                <h4 class="text-2xl font-bold">Explore Task History</h4>
                <p class="text-muted-foreground text-sm">Search for tasks to review their progress and history.</p>
            </div>

            <TaskStepper v-else />

        </div>

    </div>
</template>



<style scoped></style>