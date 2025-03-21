<script setup lang="ts">
import { useWipStore } from '@/stores/wipStore';
import Toolbar from './components/Toolbar.vue';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, onBeforeUnmount, ref, watchEffect } from 'vue';
import type { WipBatch, WipPlanQueryParams, WipTask, WipTaskGrouped } from '@/types/wip';
import CardInfo from '@/pages/wip/home/components/CardInfo.vue';
import { getS3Link } from '@/lib/utils';
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
    workCenters } = useWip()
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

    const { loading: wipLoading } = storeToRefs(wipStore)
    const workCenters = computed(() => workerDepartmentStore.getWorkCentersByDeptId(selectedDepartment.value?.id || ''))

    //Get all DONE plans > batches > tasks  
    async function getTasksByWorkCenters(params?: Partial<WipPlanQueryParams>) {
        const res = await wipStore.getWipPlansByWorkCenters({ work_centers: workCenters.value, filter: 'done', page: page.value, ...params })
        if (res) wipTaskGrouped.value?.push(...res)

        return res
    }

    //get all DONE plans > batches > tabs with filtering
    async function getTasksByWorkCentersWithFilter(data: InputFilterSearchData) {

        //if theres no search keyword refetch the selected department 
        if (!data.search.trim() && workCenters) {
            await getTasksByWorkCenters({ filterBy: filter.value.key, keyword: search.value })
            return;
        }

        //reset the page to 1 everytime filter is applied
        const res = await wipStore.getWipPlansByWorkCenters({ keyword: search.value, filterBy: filter.value.key })
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
        const res = await wipStore.getTasksByBatchId(batch.batch_id, {
            filter: 'done',
            operation_code: workCenters.value
        })

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
        workCenters
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
            <p class="text-muted-foreground">
                Inspect items and mark them as pass or fail based on quality. If failed, add details using predefined
                KPIs.
            </p>
        </div>

        <Toolbar v-model="selectedDepartment" @change="handleDepartmentChange" :loading="wipLoading">
            <template #append>
                <InputFilter v-model:filter="filter" v-model:search="search" :dropdown-data="searchFilterData"
                    :loading="wipLoading" @submit="getTasksByWorkCentersWithFilter" :disabled="!selectedDepartment">
                </InputFilter>
            </template>
        </Toolbar>

        <InfiniteScroll class="flex flex-wrap gap-4" v-if="wipTaskGrouped && wipTaskGrouped.length"
            @trigger="getNextTaskByWorkCenters" :key="selectedDepartment?.id">
            <template v-for="wipTask in wipTaskGrouped" :key="wipTask.id">
                <template v-for="product in wipTask.product_data" :key="product.id">
                    <div v-for="plan in product.plan_data" :key="plan.id"
                        class="border rounded-md p-4 shadow-sm grow space-y-2">
                        <div class="flex justify-between">
                            <CardInfo :image="getS3Link(product.thumbnail)" label="Product SKU">
                                <RouterLink :to="{ name: 'productShow', params: { productId: product.sku } }"
                                    target="_blank">
                                    {{ product.sku }}
                                </RouterLink>
                            </CardInfo>
                            <CardInfo label="Plan code">
                                {{ plan.code }}
                            </CardInfo>

                        </div>
                        <Separator orientation="horizontal" />
                        <WipBatchAccordion type="multiple" :wip-batch="plan.batch_data" @select="handleGetBatchWip">
                            <template #default="{ batch }">
                                <QCTasksDataTable v-if="batch.tasks && batch.tasks.length" :tasks="batch.tasks"
                                    @navigate-to="(task) => handlePass(task, batch)">
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

                        </WipBatchAccordion>
                    </div>
                </template>

            </template>

            <InfiniteScrollTrigger />
        </InfiniteScroll>
        <!-- fallback for undefined wipTaskGrouped -->
        <div v-else-if="!wipTaskGrouped"
            class=" border border-dashed rounded-md grid min-h-[40vh] p-4 place-content-center text-center">
            <Building class="mx-auto" />
            <h2 class="text-2xl font-bold tracking-tight">No department selected</h2>
            <p class="text-sm text-muted-foreground">click on the toolbar and select a department to
                start.</p>
        </div>
        <!-- fallback for empty array of wipTaskGrouped -->
        <div v-else class=" border border-dashed rounded-md grid min-h-[40vh] p-4 place-content-center text-center">
            <ClipboardCheck class="mx-auto" />
            <h2 class="text-2xl font-bold tracking-tight">No Tasks for Inspection</h2>
            <p class="text-sm text-muted-foreground">There are currently no tasks requiring quality inspection. Check
                back later
                for updates.</p>
        </div>

        <QcTaskDialog v-if="selectedQCTask && departmentKPIs" v-model="showQCTaskDialog" :task="selectedQCTask.task"
            :department-kpis="departmentKPIs" :verdict="selectedQCTask.verdict" :loading="wipLoading"
            @success="handleFetchBatchWip">
        </QcTaskDialog>
    </div>
</template>



<style scoped></style>