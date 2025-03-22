<script setup lang="ts">
import { InputFilter } from '@/components/app/input-filter';
import { ref, watchEffect } from 'vue';
import { inputFilterData } from '.';
import TaskStepper from '../components/TaskStepper.vue';
import { Box, FolderOpen, Search } from 'lucide-vue-next';
import { useRouteQuery } from '@vueuse/router';
import { usePlanStore } from '@/stores/planStore';
import TaskHistoryCardItem from './components/TaskHistoryCardItem.vue';
import type { TaskHistory } from '@/types/taskHistory';
import TaskHistoryCard from './components/TaskHistoryCard.vue';
import TaskHistoryCardHeader from './components/TaskHistoryCardHeader.vue';
import TaskHistoryCardBatches from './components/TaskHistoryCardBatches.vue';
import TaskHistoryCardTasks from './components/TaskHistoryCardTasks.vue';
import TaskHistoryCardHistory from './components/TaskHistoryCardHistory.vue';
import { EmptyResource } from '@/components/app/empty-resource';
import { Loader } from '@/components/app/loader';
import { storeToRefs } from 'pinia';

const planStore = usePlanStore()
const { handleFetchHistory, inputFilter, search, taskHistories, historyLoading } = useHistory()

function useHistory() {
    const filterQueryParams = useRouteQuery('filter', inputFilterData[0].key)
    const inputFilter = ref(inputFilterData.find(i => i.key === filterQueryParams.value) || inputFilterData[0])

    watchEffect(() => {
        filterQueryParams.value = inputFilter.value.key
    })

    const search = useRouteQuery<string>('q')
    const taskHistories = ref<TaskHistory[]>()
    const { loading: historyLoading } = storeToRefs(planStore)

    async function handleFetchHistory() {
        /* reset the task histories after each search */
        taskHistories.value = undefined

        const params: { [key: string]: string } = {}
        params[filterQueryParams.value] = search.value

        taskHistories.value = await planStore.getTaskHistory(params)
    }

    return {
        handleFetchHistory,
        inputFilter,
        search,
        taskHistories,
        historyLoading
    }
}

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
                <InputFilter :dropdown-data="inputFilterData" v-model:filter="inputFilter" v-model:search="search"
                    :loading="historyLoading" @submit="handleFetchHistory" />
                <p class="text-xs text-muted-foreground mt-2">View more search options by selecting the dropdown arrow
                    on the right side of the search input.
                </p>
            </div>

            <Loader v-if="historyLoading" class="min-h-[50vh]" description="Searching histories, please wait..." />

            <TaskHistoryCard v-if="taskHistories && taskHistories.length">
                <TaskHistoryCardItem v-for="taskHistory in taskHistories" :key="taskHistory.id" :history="taskHistory">
                    <template #header="{ item }">
                        <TaskHistoryCardHeader :history="item" />
                    </template>
                    <TaskHistoryCardBatches :batches="taskHistory.batches" #="{ items }">
                        <TaskHistoryCardTasks :tasks="items" #="{ item }">
                            <TaskHistoryCardHistory :task="item"></TaskHistoryCardHistory>
                        </TaskHistoryCardTasks>

                    </TaskHistoryCardBatches>
                </TaskHistoryCardItem>
            </TaskHistoryCard>
            <EmptyResource v-else-if="taskHistories && !taskHistories.length" :icon="FolderOpen"
                title="No History found" description="we can&apos;t find any data. Please try another search term." />
            <EmptyResource v-else :icon="Search" title="Explore Task History"
                description="Search for tasks to review their progress and history." />


        </div>

    </div>
</template>



<style scoped></style>