<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { SectionHeader } from '@/components/app/section-header';
import { usePlanStore } from '@/stores/planStore';
import type { OutputPosting, OutputPostingQueryParams } from '@/types/outputPosting';
import { ref, watch } from 'vue';
import { outputPostingDataTableColumns } from './data';
import { TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useDataTableChecks } from '@/composables/useDataTableChecks';
import { ButtonApp } from '@/components/app/button';
import { PaginationApp, PaginationApp2, type PaginationQuery } from '@/components/app/pagination';
import { useRoute } from 'vue-router';
import { useSimplePaginate } from '@/composables/usePaginate';
import { SearchIcon, Send } from 'lucide-vue-next';
import { ConfirmationDialog } from '@/components/app/confirmation-dialog';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import { cn, formatReadableDate } from '@/lib/utils';
import Toolbar from '../qc/home/components/Toolbar.vue';
import type { WorkerDepartment } from '@/types/workers';
import { useRouteParams, useRouteQuery } from '@vueuse/router';
import WipDateFilter from '../wip/home/components/WipDateFilter.vue';
import type { SelectedDateRange } from '../wip/data';
import { Label } from '@/components/ui/label';
import OutputPostingFilter from './components/OutputPostingFilter.vue';
import { Input } from '@/components/ui/input';

const planStore = usePlanStore()
const { loading: planLoading, errors: planErrors } = storeToRefs(planStore)

const { getOutputPostings, outputPostings, hasNextPage, hasPrevPage, handlePostToBc } = usePlan()
const { handleShowConfirmationDialog, showConfirmationDialog } = useConfirmationDialog()
const viewSelected = ref(false)
const selectedDepartment = ref<WorkerDepartment>()
const page = useRouteQuery('page', '1')
const perPage = useRouteQuery('pages', '30')
const selectedDateRange = ref<SelectedDateRange>()
const selectedFilter = ref('all')
const search = ref('')

/* @ts-ignore */
const { checkedItems, handleCheckAll, indicator, isChecked, toggleCheck } = useDataTableChecks<OutputPosting>(outputPostings)

function usePlan() {
    const { hasNextPage, hasPrevPage, items: outputPostings, paginate } = useSimplePaginate<OutputPosting>()

    async function getOutputPostings(params?: Partial<OutputPostingQueryParams>) {
        const queryParams: Partial<OutputPostingQueryParams> = {
            page: page.value,
            pages: perPage.value,
            operation_code: selectedDepartment.value?.work_centers || [],
            startDate: selectedDateRange.value?.start,
            endDate: selectedDateRange.value?.end,
            q: search.value,
            ...params,
        }

        if (selectedFilter.value !== 'all') {
            queryParams.is_approved = selectedFilter.value === 'true'
        }
        const data = await planStore.getOutputPosting(queryParams)


        if (data) {
            checkedItems.value = []
            paginate.value = data;
        }
    }

    async function handlePostToBc() {
        if (!checkedItems.value || !checkedItems.value.length) return;

        const checkedItemsIds = checkedItems.value.reduce<string[]>((acc, item) => {
            acc.push(item.id)
            return acc;
        }, [])

        await planStore.postOutputPosting({ posting_ids: checkedItemsIds })

        if (!planErrors.value) {
            await getOutputPostings({
                page: page.value,
                pages: perPage.value,
                operation_code: selectedDepartment.value?.work_centers || []
            })

            toast.info('Output Posting Info', {
                description: 'Output is successfully posted to Business Central'
            })
        } else {
            toast.error('Outpost Posting Error', {
                description: 'There\'s a problem while posting the data to Business Central'
            })
        }
    }
    return {
        getOutputPostings,
        outputPostings,
        hasNextPage,
        hasPrevPage,
        handlePostToBc
    }

}

function useConfirmationDialog() {
    const showConfirmationDialog = ref(false)

    function handleShowConfirmationDialog() {
        showConfirmationDialog.value = true
    }

    return {
        showConfirmationDialog,
        handleShowConfirmationDialog
    }
}


async function handleDepartmentChange(department: WorkerDepartment) {
    selectedDepartment.value = department
    await getOutputPostings({
        page: 1,
        pages: 30,
        operation_code: department.work_centers,
        startDate: selectedDateRange.value?.start,
        endDate: selectedDateRange.value?.end
    })
}

watch(page, async () => {
    await getOutputPostings()
})
watch(perPage, async () => {
    await getOutputPostings()
})
watch(selectedDateRange, async () => {
    await getOutputPostings()
})
watch(selectedFilter, async () => {
    await getOutputPostings()
})

</script>

<template>

    <div class="container space-y-6">
        <SectionHeader title="Output posting"
            description="Carefully check the task UUIDS before posting to prevent incorrect data on Business Central. QC failed tasks wont be included" />

        <header class="position sticky -top-6 z-10 bg-muted p-4 rounded-md shadow-sm">
            <ButtonApp :prepend-icon="Send" :disabled="!checkedItems.length" @click="handleShowConfirmationDialog">Post
                to Business Central</ButtonApp>
        </header>

        <main class="border rounded-md shadow-sm">
            <div class="flex items-center flex-wrap gap-4 p-4">
                <Toolbar class="border-none shadow-none p-0 grow" @change="handleDepartmentChange" />
                <div class="relative">
                    <SearchIcon class="text-muted-foreground size-4 absolute left-2 top-1/2 -translate-y-1/2" />
                    <Input class="pl-8" placeholder="Search" v-model="search"
                        @keydown.enter.prevent="getOutputPostings" />
                </div>
                <div class="min-w-[12rem]">
                    <OutputPostingFilter v-model="selectedFilter" />
                </div>
                <WipDateFilter v-model="selectedDateRange" />
            </div>
            <DataTable v-if="outputPostings" :items="viewSelected ? checkedItems : outputPostings"
                :columns="outputPostingDataTableColumns" :loading="planLoading">
                <template #header.check="{ item }">
                    <TableCell>
                        <Checkbox @update:checked="handleCheckAll" :checked="indicator" />
                    </TableCell>
                </template>
                <template #item.check="{ item }">
                    <TableCell>
                        <Checkbox @click="toggleCheck(item)" :checked="isChecked(item)" />
                    </TableCell>
                </template>

                <template #item.plan_code="{ item }">
                    <TableCell>
                        <span class="font-medium"> {{ item.plan_code }}</span>
                    </TableCell>
                </template>
                <template #item.plan_task_id="{ item }">
                    <TableCell class="flex flex-wrap gap-2">
                        <span class="uppercase rounded-md border px-2 text-xs"
                            v-for="(task, index) in item.plan_task_id" :key="`${item.id}-${index}`"> {{ task
                            }}</span>
                    </TableCell>
                </template>
                <template #item.task_count="{ item }">
                    <TableCell>
                        <span class="uppercase rounded-md border px-2 text-xs"> {{ item.plan_task_id.length }}</span>
                    </TableCell>
                </template>

                <template #item.is_approved="{ item }">
                    <TableCell>
                        <span
                            :class="cn('border rounded-lg py-1 px-2 font-medium text-xs', item.is_approved ? 'bg-emerald-400/30 text-emerald-500 border-emerald-500' : 'bg-amber-400/30 text-amber-500 border-amber-500')">{{
                                item.is_approved ? 'Approved' : 'Pending' }}</span>
                    </TableCell>
                </template>

                <template #item.updated_at="{ item }">
                    <TableCell>
                        <span class="text-muted-foreground text-xs">{{ formatReadableDate(item.updated_at) }}</span>
                    </TableCell>
                </template>

                <template #footer>
                    <div class="flex justify-between">
                        <ButtonApp variant="secondary" size="sm" @click="viewSelected = !viewSelected">View selected
                        </ButtonApp>
                        <PaginationApp2 v-model:page="page" v-model:pages="perPage" :disable-prev="!hasPrevPage"
                            :disable-next="!hasNextPage" />
                    </div>
                </template>
            </DataTable>
        </main>

        <ConfirmationDialog v-model="showConfirmationDialog" title="Read before proceeding" @yes="handlePostToBc"
            description="You are about to post data to Business Central">
            <div>Please double-check all selected output, as it will affect related data in Business Central. Are you
                sure you
                want to post this output data to Business Central?</div>
        </ConfirmationDialog>
    </div>
</template>


<style scoped></style>