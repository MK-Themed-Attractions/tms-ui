<script setup lang="ts">
import { useWipStore } from '@/stores/wipStore';
import Toolbar from './components/Toolbar.vue';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, onBeforeUnmount, ref, watch, watchEffect } from 'vue';
import type { WipBatch, WipPlanQueryParams, WipTask, WipTaskGrouped, WipTaskQueryParams } from '@/types/wip';
import CardInfo from '@/pages/wip/home/components/CardInfo.vue';
import { formatReadableDate, getIconByPlanStatus, getS3Link } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import WipBatchAccordion from '@/pages/wip/home/components/WipBatchAccordion.vue';
import QCTasksDataTable from './components/QCTasksDataTable.vue';
import { searchFilterData, type QCTaskVerdict } from './data';

import { TableCell } from '@/components/ui/table';
import { AlertCircle, Building, ClipboardCheck, Ellipsis } from 'lucide-vue-next';
import QCTaskDropdownMenu from './components/QCTaskDropdownMenu.vue';
import QcTaskDialog from './components/QcTaskDialog.vue';
import { useQcStore } from '@/stores/qcStore';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import { useTaskControls } from '@/composables/useTaskControls';
import { InputFilter, type InputFilterDropdownData, type InputFilterSearchData } from '@/components/app/input-filter';
import { InfiniteScroll, InfiniteScrollTrigger } from '@/components/app/infinite-scroll';
import type { WorkerDepartment } from '@/types/workers';
import { useAuthStore } from '@/stores/authStore';
import { TaskGroup, TaskGroupImage, TaskGroupLabel } from '@/components/app/task-group';
import { RouterLink } from 'vue-router';
import Badge from '@/components/ui/badge/Badge.vue';
import { DataTableLoader } from '@/components/app/data-table';
import { batchWipSuccessKey } from '@/lib/injectionKeys';
import WipSkeleton from '@/pages/wip/home/components/WipSkeleton.vue';
import WipDateFilter from '@/pages/wip/home/components/WipDateFilter.vue';
import type { SelectedDateRange } from '@/pages/wip/data';

const authStore = useAuthStore()
const { loading: authLoading } = storeToRefs(authStore)
const wipStore = useWipStore()
const {
    getTasksByWorkCenters,
    wipTaskGrouped,
    wipLoading,
    handleGetBatchWip,
    selectedDepartment,
    handleFetchBatchWip,
    getTasksByWorkCentersWithFilter,
    filter,
    search,
    page,
    getNextTaskByWorkCenters,
    selectedBatch,
    workCenters,
    selectedDateRange } = useWip()
const { handleFail, handlePass, selectedQCTask, showQCTaskDialog, departmentKPIs, getDepartmentKPIs } = useQC()
const { hadInspected } = useTaskControls()
const workerDepartmentStore = useWorkerDepartmentStore()

function useWip() {

    const selectedDepartment = ref<WorkerDepartment>()
    const wipTaskGrouped = ref<WipTaskGrouped[]>()
    const selectedBatch = ref<WipBatch>()
    const search = ref<string>()
    const filter = ref<InputFilterDropdownData>(searchFilterData[0])
    const page = ref(1)
    const selectedDateRange = ref<SelectedDateRange>()

    watch(selectedDateRange, async (newValue) => {
        if (!selectedDepartment.value) return;

        await getTasksByWorkCentersWithFilter()
    })

    const { loading: wipLoading } = storeToRefs(wipStore)
    const workCenters = computed(() => workerDepartmentStore.getWorkCentersByDeptId(selectedDepartment.value?.id || ''))

    //Get all DONE plans > batches > tasks  
    async function getTasksByWorkCenters(params?: Partial<WipPlanQueryParams>) {
        const myParams: Partial<WipPlanQueryParams> = {
            work_centers: workCenters.value,
            filter: 'done',
            page: page.value,
        }

        if (search.value) {
            myParams.keyword = search.value;
            myParams.filterBy = <"product-sku" | "plan-code">filter.value.key
        } else {
            myParams.startDate = selectedDateRange.value?.start
            myParams.endDate = selectedDateRange.value?.end
        }

        const res = await wipStore.getWipPlansByWorkCenters({
            ...myParams,
            ...params
        })
        if (res) wipTaskGrouped.value?.push(...res)

        return res
    }

    //get all DONE plans > batches > tabs with filtering
    async function getTasksByWorkCentersWithFilter() {

        wipTaskGrouped.value = []
        page.value = 1
        const params: Partial<WipPlanQueryParams> = {}

        //reset the page to 1 everytime filter is applied
        const res = await getTasksByWorkCenters(params)
        if (res) wipTaskGrouped.value = res;
    }

    async function getNextTaskByWorkCenters(cb: (canAddMore: boolean) => void) {
        const res = await getTasksByWorkCenters({
            page: ++page.value
        })

        if (res && !res.length) {
            cb(false)
        }
    }

    //Get all done tasks for a batch
    async function fetchBatchWip(batch: WipBatch) {
        const params: Partial<WipTaskQueryParams> = {
            filter: 'done',
            operation_code: workCenters.value,

        }
        if (!search.value) {
            params.startDate = selectedDateRange.value?.start
            params.endDate = selectedDateRange.value?.end
        }

        const res = await wipStore.getTasksByBatchId(batch.batch_id, params)

        if (res) {
            batch.tasks = res;
        }
    }

    //fetch batch wips only when batch doesnt have tasks in it
    async function handleGetBatchWip(batch: WipBatch) {

        selectedBatch.value = batch;
        //only fetch the data when theres no tasks on batch to avoid repeated fetch
        if (batch.tasks) return;
        await fetchBatchWip(batch)
    }

    //getch batch wip without batch parameter and using selectedBatch
    async function handleFetchBatchWip() {

        if (!selectedBatch.value) return
        await fetchBatchWip(selectedBatch.value)
    }


    return {
        wipTaskGrouped,
        wipLoading,
        getTasksByWorkCenters,
        getTasksByWorkCentersWithFilter,
        getNextTaskByWorkCenters,
        handleGetBatchWip,
        selectedDepartment,
        selectedBatch,
        handleFetchBatchWip,
        search,
        filter,
        page,
        workCenters,
        selectedDateRange
    }
}

function useQC() {

    const qcStore = useQcStore()
    const { departmentKPIs } = storeToRefs(qcStore)

    const showQCTaskDialog = ref(false)
    const selectedQCTask = ref<{ task: WipTask, verdict: QCTaskVerdict }>()

    function handlePass(task: WipTask, batch: WipBatch) {
        selectedBatch.value = batch;
        selectedQCTask.value = {
            task,
            verdict: 'pass'
        }

        showQCTaskDialog.value = true;
    }
    function handleFail(task: WipTask, batch: WipBatch) {
        selectedBatch.value = batch;
        selectedQCTask.value = {
            task,
            verdict: 'fail'
        }
        showQCTaskDialog.value = true;
    }

    //Get list of KPI for a work center
    async function getDepartmentKPIs(workCenters: string[]) {
        await qcStore.getDepartmentKPIs({ codes: workCenters })
    }

    return {
        showQCTaskDialog,
        selectedQCTask,
        handleFail,
        handlePass,

        getDepartmentKPIs,
        departmentKPIs
    }
}

async function handleDepartmentChange(department: WorkerDepartment) {
    selectedDepartment.value = department;
    wipStore.pointToMicroservice(department.ms_url)

    //reset the page and taskGroup everytime the department changes
    wipTaskGrouped.value = []
    page.value = 1;
    await getTasksByWorkCenters({ work_centers: workCenters.value })
    await getDepartmentKPIs(workCenters.value || [])
}

onBeforeMount(() => {
    wipTaskGrouped.value = []
})
onBeforeUnmount(() => {
    wipTaskGrouped.value = []
})

</script>
<template>
    <div class="space-y-6 container">
        <div>
            <h1 class="text-lg font-semibold md:text-2xl">Quality Control</h1>
            <p class="text-muted-foreground text-sm">
                Inspect items and mark them as pass or fail based on quality. If failed, add details using predefined
                KPIs.
            </p>
        </div>

        <Toolbar v-model="selectedDepartment" @change="handleDepartmentChange" :loading="wipLoading || authLoading">
            <template #append>
                <InputFilter v-model:filter="filter" v-model:search="search" :dropdown-data="searchFilterData"
                    :loading="wipLoading || authLoading" @submit="getTasksByWorkCentersWithFilter"
                    :disabled="!selectedDepartment">
                </InputFilter>

                <div class="basis-full flex justify-end">
                    <WipDateFilter v-model="selectedDateRange" :disabled="Boolean(search)" :loading="wipLoading" />
                </div>
            </template>
        </Toolbar>

        <InfiniteScroll class="flex flex-wrap gap-4"
            v-if="wipTaskGrouped && wipTaskGrouped.length && selectedDepartment" @trigger="getNextTaskByWorkCenters"
            :key="selectedDepartment?.id">
            <TaskGroup v-for="parentProduct in wipTaskGrouped" :key="parentProduct.id" class="items-start">
                <div class="basis-full flex gap-2 items-center">
                    <TaskGroupImage :image="parentProduct.thumbnail" />
                    <TaskGroupLabel label="Parent SKU">
                        <RouterLink :to="{ name: 'productShow', params: { productId: parentProduct.sku } }"
                            target="_blank">
                            {{ parentProduct.sku }}
                        </RouterLink>
                    </TaskGroupLabel>
                </div>

                <!-- CHILD -->
                <div v-for="(product, index) in parentProduct.product_data" :key="product.id"
                    class="basis-[33rem] grow ">
                    <div v-for="plan in product.plan_data" :key="plan.id">
                        <div class="flex gap-4 bg-muted/20 border rounded-md p-2 items-center">
                            <TaskGroupImage :image="product.thumbnail || ''" />
                            <TaskGroupLabel label="plan code">
                                <RouterLink
                                    :to="{ name: 'taskHistoryIndex', query: { q: plan.code, filter: 'plan_code' } }"
                                    target="_blank" class="hover:underline">
                                    {{ plan.code }}
                                </RouterLink>
                            </TaskGroupLabel>
                            <TaskGroupLabel label="product SKU">
                                <RouterLink :to="{ name: 'productShow', params: { productId: product.sku } }"
                                    target="_blank" class="hover:underline">
                                    {{ product.sku }}
                                </RouterLink>
                            </TaskGroupLabel>
                            <div class="ml-auto flex flex-col justify-center gap-2">
                                <Badge class="ml-auto capitalize gap-1">
                                    <component :is="getIconByPlanStatus(plan.status_code)" class="size-4" />
                                    {{ plan.status_code }}
                                </Badge>
                                <p class="text-xs text-muted-foreground">{{ formatReadableDate(plan.created_at) }}</p>
                            </div>
                        </div>


                        <WipBatchAccordion type="multiple" :wip-batch="plan.batch_data" @select="handleGetBatchWip"
                            :loading="wipLoading">
                            <template #default="{ batch }">
                                <QCTasksDataTable v-if="batch.tasks && batch.tasks.length" :tasks="batch.tasks"
                                    :loading="wipLoading" @navigate-to="(task) => handlePass(task, batch)">
                                    <template #item.actions="{ item }">
                                        <TableCell>
                                            <QCTaskDropdownMenu @pass="handlePass(item, batch)"
                                                @fail="handleFail(item, batch)" v-if="!hadInspected(item.status)">
                                                <Ellipsis
                                                    class="size-4 text-muted-foreground group-hover:visible invisible" />
                                            </QCTaskDropdownMenu>
                                        </TableCell>
                                    </template>
                                </QCTasksDataTable>
                                <div v-else>
                                    <div class="flex gap-2 items-center justify-center">
                                        <AlertCircle class="size-4 text-muted-foreground" />
                                        <p>All of the tasks for this batch are not done yet.</p>
                                    </div>
                                </div>
                            </template>
                            <template #fallback="{ batch }">
                                <DataTableLoader v-if="!batch.tasks" :col-count="4" />
                            </template>
                        </WipBatchAccordion>

                    </div>
                </div>
            </TaskGroup>

            <InfiniteScrollTrigger>
                <WipSkeleton faded />
            </InfiniteScrollTrigger>
        </InfiniteScroll>

        <!-- fallback for undefined wipTaskGrouped -->
        <div v-else-if="!selectedDepartment"
            class=" border border-dashed rounded-md grid min-h-[40vh] p-4 place-content-center text-center">
            <Building class="mx-auto" />
            <h2 class="text-2xl font-bold tracking-tight">No department selected</h2>
            <p class="text-sm text-muted-foreground">click on the toolbar and select a department to
                start.</p>
        </div>

        <!-- fallback for empty array of wipTaskGrouped -->
        <div v-else-if="!wipTaskGrouped || !wipTaskGrouped.length && !wipLoading"
            class=" border border-dashed rounded-md grid min-h-[40vh] p-4 place-content-center text-center">
            <ClipboardCheck class="mx-auto" />
            <h2 class="text-2xl font-bold tracking-tight">No Tasks for Inspection</h2>
            <p class="text-sm text-muted-foreground">There are currently no tasks requiring quality inspection. Check
                back later
                for updates.</p>
        </div>

        <div v-else class="space-y-4">
            <WipSkeleton />
            <WipSkeleton faded />
        </div>

        <QcTaskDialog v-if="selectedQCTask && departmentKPIs" v-model="showQCTaskDialog" :task="selectedQCTask.task"
            :department-kpis="departmentKPIs" :verdict="selectedQCTask.verdict" :loading="wipLoading"
            @success="handleFetchBatchWip">
        </QcTaskDialog>
    </div>
</template>



<style scoped></style>