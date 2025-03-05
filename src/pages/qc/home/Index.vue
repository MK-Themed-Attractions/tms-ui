<script setup lang="ts">
import { useWipStore } from '@/stores/wipStore';
import Toolbar from './components/Toolbar.vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { WipBatch, WipTask, WipTaskGrouped } from '@/types/wip';
import CardInfo from '@/pages/wip/home/components/CardInfo.vue';
import { getS3Link, toOrdinal } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import WipBatchAccordion from '@/pages/wip/home/components/WipBatchAccordion.vue';
import QCTasksDataTable from './components/QCTasksDataTable.vue';
import { qcTaskDataTableColumn, type QCTaskVerdict } from './data';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import { AlertCircle, Ellipsis } from 'lucide-vue-next';
import QCTaskDropdownMenu from './components/QCTaskDropdownMenu.vue';
import QcTaskDialog from './components/QcTaskDialog.vue';
import { useQcStore } from '@/stores/qcStore';

const { getTasksByWorkCenters, wipTaskGrouped, wipLoading, handleGetBatchWip } = useWip()
const { handleFail, handlePass, selectedQCTask, showQCTaskDialog, departmentKPIs, getDepartmentKPIs } = useQC()

function useWip() {
    const wipStore = useWipStore()
    const wipTaskGrouped = ref<WipTaskGrouped[]>()
    const { loading: wipLoading } = storeToRefs(wipStore)

    async function getTasksByWorkCenters(workCenters: string[]) {
        const res = await wipStore.getWipPlansByWorkCenters({ filter: 'done', work_centers: workCenters })
        if (res) wipTaskGrouped.value = res;
    }

    async function fetchBatchWip(batch: WipBatch) {
        const res = await wipStore.getTasksByBatchId(batch.batch_id, {
            filter: 'done'
        })

        if (res) {
            batch.tasks = res;
        }
    }

    //fetch batch wips only when batch doesnt have tasks in it
    async function handleGetBatchWip(batch: WipBatch) {
        //only fetch the data when theres no tasks on batch to avoid repeated fetch
        if (batch.tasks) return;
        await fetchBatchWip(batch)
    }

    return {
        wipTaskGrouped,
        wipLoading,
        getTasksByWorkCenters,
        handleGetBatchWip,
    }
}

function useQC() {

    const qcStore = useQcStore()
    const { departmentKPIs } = storeToRefs(qcStore)

    const showQCTaskDialog = ref(false)
    const selectedQCTask = ref<{ task: WipTask, verdict: QCTaskVerdict }>()
    function handlePass(task: WipTask) {
        selectedQCTask.value = {
            task,
            verdict: 'pass'
        }

        showQCTaskDialog.value = true;
    }
    function handleFail(task: WipTask) {
        selectedQCTask.value = {
            task,
            verdict: 'fail'
        }
        showQCTaskDialog.value = true;
    }

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

async function handleDepartmentChange(workCenterIds: string[]) {
    await getTasksByWorkCenters(workCenterIds)
    await getDepartmentKPIs(workCenterIds)
}


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

        <Toolbar @change="handleDepartmentChange" :loading="wipLoading">
        </Toolbar>

        <div class="flex flex-wrap gap-4">
            <template v-for="wipTask in wipTaskGrouped" :key="wipTask.id">
                <template v-for="product in wipTask.product_data" :key="product.id">
                    <div v-for="plan in product.plan_data" :key="plan.id"
                        class="border rounded-md p-4 shadow-sm basis-[30rem] grow space-y-2">
                        <div class="flex justify-between">
                            <CardInfo :image="getS3Link(product.thumbnail)" label="Product SKU">{{ product.sku }}
                            </CardInfo>
                            <CardInfo label="Plan code">{{ plan.code }}</CardInfo>

                        </div>
                        <Separator orientation="horizontal" />
                        <WipBatchAccordion type="multiple" :wip-batch="plan.batch_data" @select="handleGetBatchWip">
                            <template #default="{ batch }">
                                <QCTasksDataTable v-if="batch.tasks && batch.tasks.length" :tasks="batch.tasks">
                                    <template #item.actions="{ item }">
                                        <TableCell>
                                            <QCTaskDropdownMenu @pass="handlePass(item)" @fail="handleFail(item)">
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
        </div>

        <QcTaskDialog v-if="selectedQCTask && departmentKPIs" v-model="showQCTaskDialog" :task="selectedQCTask.task"
            :department-kpis="departmentKPIs" :verdict="selectedQCTask.verdict"></QcTaskDialog>
    </div>
</template>



<style scoped></style>