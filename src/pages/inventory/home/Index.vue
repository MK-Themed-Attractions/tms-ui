<script setup lang="ts">
import ButtonApp from '@/components/app/button/ButtonApp.vue';
import { InfiniteScroll, InfiniteScrollTrigger } from '@/components/app/infinite-scroll';
import type { InputFilterDropdownData } from '@/components/app/input-filter';
import InputFilter from '@/components/app/input-filter/InputFilter.vue';
import { SectionHeader } from '@/components/app/section-header';
import { TaskGroup, TaskGroupImage, TaskGroupLabel } from '@/components/app/task-group';
import { Badge } from '@/components/ui/badge';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuLabel from '@/components/ui/dropdown-menu/DropdownMenuLabel.vue';
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import { formatReadableDate, getIconByPlanStatus, getS3Link } from '@/lib/utils';
import { searchFilterData } from '@/pages/wip/data';
import Toolbar from '@/pages/wip/home/components/Toolbar.vue';
import WipBatchAccordion from '@/pages/wip/home/components/WipBatchAccordion.vue';
import WipTaskDropdown from '@/pages/wip/home/components/WipTaskDropdown.vue';
import { useWipStore } from '@/stores/wipStore';
import type { WipBatch, WipPlan, WipPlanQueryParams, WipTask, WipTaskGrouped, WipTaskQueryParams } from '@/types/wip';
import type { WorkerDepartment } from '@/types/workers';
import { ArrowRight, Ellipsis, Layers, Merge } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, provide, ref } from 'vue';
import { RouterLink } from 'vue-router';
import AllocateDialog from '../components/AllocateDialog.vue';
import { wipBatchKey, wipPlanKey } from '../data';
import { useInventoryStore } from '@/stores/inventoryStore';
import InventoryTaskDataTable from '../components/InventoryTaskDataTable.vue';


const { handleDepartmentSelectionChange, selectedDepartment, wipTaskGroup, fetchBatchWip, taskIds, selectedBatch, selectedPlan } = useWip()
const { page, handleFetchNextPage, filter, search, handleFetchWipGroup, statusFilter } = useInifiteScroll()
const { handleShowAllocateDialog, showAllocateDialog, selectedTaskIds, handleShowAllocateDialogForTask } = useBom()
const wipStore = useWipStore()
const { loading: wipLoading } = storeToRefs(wipStore)
const inventoryStore = useInventoryStore()
const { loading: inventoryLoading } = storeToRefs(inventoryStore)


function useInifiteScroll() {
    const page = ref(1)
    const search = ref('')
    const filter = ref<InputFilterDropdownData>(searchFilterData[0])
    const statusFilter = ref('assigned')

    async function handleFetchNextPage(cb: (canAddMore: boolean) => void) {

        if (!selectedDepartment.value) return

        const params: Partial<WipPlanQueryParams> = {
            page: ++page.value,
            work_centers: selectedDepartment.value.work_centers,
            is_accessible: true,
            filter: statusFilter.value,

        }


        if (search.value) {
            params.filterBy = filter.value.key as WipPlanQueryParams['filterBy']
            params.keyword = search.value
        }


        const data = await wipStore.getWipPlansByWorkCenters(params)

        if (data && data.length)
            wipTaskGroup.value.push(...data)
        else
            cb(false)
    }

    async function handleFetchWipGroup() {
        if (!selectedDepartment.value) return

        page.value = 1
        const params: Partial<WipPlanQueryParams> = {
            page: page.value,
            work_centers: selectedDepartment.value.work_centers,
            is_accessible: true,
            filter: statusFilter.value,

        }


        if (search.value) {
            params.filterBy = filter.value.key as WipPlanQueryParams['filterBy']
            params.keyword = search.value
        }


        const data = await wipStore.getWipPlansByWorkCenters(params)

        if (data && data.length)
            wipTaskGroup.value = data

    }

    return {
        page,
        search,
        filter,
        handleFetchNextPage,
        handleFetchWipGroup,
        statusFilter
    }
}

function useWip() {
    const selectedDepartment = ref<WorkerDepartment>()
    const selectedBatch = ref<WipBatch>()
    const selectedPlan = ref<WipPlan>()
    const wipTaskGroup = ref<WipTaskGrouped[]>([])

    const taskIds = computed(() => {
        if (!selectedBatch.value) return

        return selectedBatch.value.tasks?.map(t => t.task_plan_id)
    })

    async function handleDepartmentSelectionChange(department: WorkerDepartment) {
        selectedDepartment.value = department

        wipStore.pointToMicroservice(department.ms_url)

        search.value = ''
        const data = await wipStore.getWipPlansByWorkCenters({
            is_accessible: true,
            work_centers: department.work_centers,
            filter: statusFilter.value,

        })

        if (data)
            wipTaskGroup.value = data
    }

    async function fetchBatchWip(batch: WipBatch, plan: WipPlan) {
        selectedBatch.value = batch
        selectedPlan.value = plan;

        if (!selectedDepartment.value || (batch.tasks && batch.allocated_boms)) return

        const params: Partial<WipTaskQueryParams> = {
            operation_code: selectedDepartment.value.work_centers,
            is_accessible: 1,
            filter: statusFilter.value as 'assigned',
        }

        const res = await wipStore.getTasksByBatchId(batch.batch_id, params)
        if (res) {
            batch.tasks = res;
        }

        const inventoryParams = {
            plan_task_ids: selectedBatch.value.tasks?.map(t => t.task_plan_id) || [],
        }

        await inventoryStore.validateToken()
        const inventoryRes = await inventoryStore.getInventoryConsumptionByPlanTaskId(inventoryParams)

        if (inventoryRes) {
            batch.allocated_boms = inventoryRes
        }
    }


    return {
        handleDepartmentSelectionChange,
        selectedDepartment,
        wipTaskGroup,
        fetchBatchWip,
        selectedBatch,
        selectedPlan,
        taskIds
    }
}

function useBom() {
    const showAllocateDialog = ref(false)
    const selectedTaskIds = ref<string[]>([])

    function handleShowAllocateDialog(batch: WipBatch, plan: WipPlan) {
        selectedBatch.value = batch
        selectedPlan.value = plan
        
        if (!taskIds.value) return;

        showAllocateDialog.value = true;
        selectedTaskIds.value = taskIds.value
    }

    function handleShowAllocateDialogForTask(task: WipTask) {
        if (!taskIds.value) return;

        selectedTaskIds.value = [task.task_plan_id]
        showAllocateDialog.value = true
    }

    return {
        showAllocateDialog,
        selectedTaskIds,
        handleShowAllocateDialog,
        handleShowAllocateDialogForTask
    }
}

provide(wipBatchKey, computed(() => selectedBatch.value))
provide(wipPlanKey, computed(() => selectedPlan.value))
</script>

<template>
    <div class="container space-y-6">
        <SectionHeader title="BOM Inventory" description="Bill of Materials management page" />
        <Toolbar @change="handleDepartmentSelectionChange">
            <template #append>
                <InputFilter v-model:search="search" v-model:filter="filter" :dropdown-data="searchFilterData"
                    @submit="handleFetchWipGroup" :disabled="!selectedDepartment" :loading="wipLoading">
                </InputFilter>
            </template>
        </Toolbar>

        <InfiniteScroll @trigger="handleFetchNextPage">
            <TaskGroup v-for="parentProduct in wipTaskGroup" :key="parentProduct.id">
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
                    class="basis-[33rem] grow">
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

                        <WipBatchAccordion type="multiple" :wip-batch="plan.batch_data"
                            @select="(batch) => fetchBatchWip(batch, plan)" :loading="wipLoading || inventoryLoading">
                            <template #default="{ batch }">
                                <InventoryTaskDataTable v-if="batch.tasks" :tasks="batch.tasks"
                                    :allocated-boms="batch.allocated_boms" :loading="wipLoading || inventoryLoading">

                                    <template #header.actions>
                                        <TableCell>
                                            <WipTaskDropdown>
                                                <template #activator>
                                                    <ButtonApp class="size-6" variant="outline" size="icon">
                                                        <Ellipsis class="size-4" />
                                                    </ButtonApp>
                                                </template>


                                                <DropdownMenuLabel>Batch Operations</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem @click="handleShowAllocateDialog(batch,plan)">
                                                    <Layers /> Allocate to batch
                                                </DropdownMenuItem>

                                            </WipTaskDropdown>
                                        </TableCell>
                                    </template>

                                    <template #item.actions="{ item }">
                                        <TableCell>
                                            <WipTaskDropdown>
                                                <template #activator>
                                                    <Ellipsis class="invisible group-hover:visible size-4 m-auto" />
                                                </template>

                                                <DropdownMenuLabel>Task Operations</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    @click="handleShowAllocateDialogForTask(<WipTask>item)">
                                                    <ArrowRight /> Allocate Materials
                                                </DropdownMenuItem>

                                            </WipTaskDropdown>

                                        </TableCell>

                                    </template>
                                </InventoryTaskDataTable>
                            </template>
                        </WipBatchAccordion>
                    </div>
                </div>
            </TaskGroup>
            <InfiniteScrollTrigger />
        </InfiniteScroll>


        <AllocateDialog v-if="taskIds" v-model="showAllocateDialog" :task-ids="selectedTaskIds" />
    </div>
</template>


<style scoped></style>