<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { useWorkerStore } from '@/stores/workerStore';
import { storeToRefs } from 'pinia';
import { selectedDepartmentKey, wipWorkerDataTableColumns, workCentersKey, workerPerPage } from '../../data';
import { PaginationApp, PaginationApp2, type PaginationQuery } from '@/components/app/pagination';
import { TableCell, TableHead } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useDataTableChecks } from '@/composables/useDataTableChecks';
import { computed, inject, ref, watch, watchEffect } from 'vue';
import { ButtonApp } from '@/components/app/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-vue-next';
import type { Worker, WorkerQueryParams } from '@/types/workers';

const emits = defineEmits<{
    (e: 'change', workers: Worker[]): void
}>()
const workerStore = useWorkerStore()
const { workers } = storeToRefs(workerStore)
const { hasNextPage, hasPrevPage, loading } = storeToRefs(workerStore)
const selectedDepartment = inject(selectedDepartmentKey);
const page = ref('1')

// const workers = workerStore.assignableWorkers(workCenters!.value || [])

const params = computed<Partial<WorkerQueryParams>>(() => {
    const departmentID = selectedDepartment && selectedDepartment.value ? selectedDepartment.value.id : ''

    return {
        filters: [
            {
                column: 'is_active',
                values: ['true']
            }, {
                column: 'department_id',
                values: [departmentID]
            }
        ],
        includes: 'department',
        per_page: workerPerPage,
    }
})

/* @ts-ignore */
const { isChecked, checkedItems, handleCheckAll, indicator, toggleCheck } = useDataTableChecks<Worker>(workers)

const { handleSearchWorkers, search } = useSearch()

//emit an event when checkItems changes
watchEffect(() => {
    if (checkedItems.value)
        emits('change', JSON.parse(JSON.stringify(checkedItems.value)))
})

//show only the selected workers
const showSelectedOnly = ref(false)

//show workers or the selected workers based on showSelectedOnly field
const filteredWorkers = computed(() => {
    return showSelectedOnly.value ? checkedItems.value : workers.value
})


async function handleQueryChange() {
    await workerStore.getWorkers({ ...params.value, page: page.value, per_page: workerPerPage, })
}

function useSearch() {
    const search = ref('')

    async function searchWorkers() {
        await workerStore.getWorkers({
            ...params.value,
            page: 1,
            q: search.value,
        })
    }

    async function handleSearchWorkers() {
        if (search.value) {
            await searchWorkers()
        }
    }

    watch(search, async (newValue) => {
        if (!newValue) {
            await searchWorkers()
        }
    })
    return {
        search,
        handleSearchWorkers
    }
}

/* INITIALIZE WORKERS */
await workerStore.getWorkers(params.value)

watchEffect(async () => {
    if (page.value)
        await handleQueryChange()
})

</script>

<template>
    <div class="border rounded-md shadow-sm">

        <div class="p-4 relative">
            <Search class="text-muted-foreground size-4 absolute top-1/2 -translate-y-1/2 left-6" />
            <Input class="pl-8" placeholder="Search employee..." v-model="search"
                @keydown.enter="handleSearchWorkers" />
        </div>
        <DataTable v-if="filteredWorkers" :items="filteredWorkers" :columns="wipWorkerDataTableColumns">
            <template #header.select="{ item }">
                <TableHead>
                    <Checkbox @update:checked="handleCheckAll" :checked="indicator"></Checkbox>
                </TableHead>
            </template>
            <template #item.select="{ item }">
                <TableCell>
                    <Checkbox @click="toggleCheck(item)" :checked="isChecked(item)"></Checkbox>
                </TableCell>
            </template>
            <template #footer="{ colSpan }">
                <div class="flex justify-between p-0">
                    <ButtonApp size="sm" variant="secondary" :disabled="!checkedItems.length"
                        @click="showSelectedOnly = !showSelectedOnly">
                        {{ showSelectedOnly ? 'Show All' : 'Show selected' }}
                    </ButtonApp>
                    <PaginationApp2 v-model:page="page" :disable-next="!hasNextPage" :disable-prev="!hasPrevPage"
                        :loading="loading" />
                    <!-- <PaginationApp page-name="worker-page" per-page-name="worker-per-page" v-if="!showSelectedOnly"
                        :default-per-page="workerPerPage" class="col-span-full" :disable-prev="!hasPrevPage"
                        :loading="loading" :disable-next="!hasNextPage" @change:query="handleQueryChange">
                    </PaginationApp> -->
                </div>
            </template>
        </DataTable>
    </div>
</template>



<style scoped></style>