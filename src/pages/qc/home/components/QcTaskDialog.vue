<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatReadableDate } from '@/lib/utils';
import type { WipTask } from '@/types/wip';
import type { QCTaskVerdict } from '../data';

import type { DepartmentKPI, DepartmentKPIForm, DepartmentKPIPayload } from '@/types/qc';
import { ref, watchEffect } from 'vue';
import { ConfirmationDialog } from '@/components/app/confirmation-dialog';
import { useWipStore } from '@/stores/wipStore';
import QcKpiChecklist from './QcKpiChecklist.vue';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';


const props = defineProps<{
    task: WipTask
    verdict: QCTaskVerdict //default verdict
    departmentKpis: DepartmentKPI[]
    loading?: boolean
}>()
const emits = defineEmits<{
    (e: 'success'): void
}>()

const dialog = defineModel({ default: false })
const showConfirmationDialog = ref(false)
const finalVerdict = ref<QCTaskVerdict>('pass')
const checkedKpisPass = ref<DepartmentKPIForm[]>()
const checkedKpisFail = ref<DepartmentKPIForm[]>()

const wipStore = useWipStore()
const { errors: wipErrors } = storeToRefs(wipStore)

async function handleSubmit() {
    if (!checkedKpisPass.value || !checkedKpisFail.value) return;

    if (finalVerdict.value === 'pass')
        checkedKpisPass.value.forEach(changeTaskStatus);
    else checkedKpisFail.value.forEach(changeTaskStatus)

    //function for looping through each work center
    async function changeTaskStatus(dept: DepartmentKPIForm) {

        //collect the KPI id in an array
        const kpiArray = dept.kpi.reduce<string[]>((acc, kpi) => {
            if (kpi.checked)
                acc.push(kpi.id)
            return acc;
        }, [])


        //contruct the payload
        const payload: DepartmentKPIPayload = {
            status: finalVerdict.value,
            department_kpi_id: dept.id,
            checked_kpi_id: kpiArray,
            comment: dept.comment
        }

        await wipStore.changeTaskQCStatus(props.task.id, payload)

        if (!wipErrors.value) {
            toast.info('QC Info', {
                description: 'Task has been successfully inspected.'
            })
            dialog.value = false;
            emits('success')
        } else {
            toast.error('QC Info', {
                description: 'Something went wrong while inspecting the task.'
            })
        }
    }
}

function handleQCEvaluate(verdict: QCTaskVerdict) {
    finalVerdict.value = verdict
    showConfirmationDialog.value = true;
}


watchEffect(() => {
    const updatedKpi = props.departmentKpis.map(dept => {
        return {
            ...dept,
            kpi: dept.kpi.map(k => {
                return {
                    ...k,
                    checked: true
                }
            })
        }
    })
    checkedKpisFail.value = JSON.parse(JSON.stringify(updatedKpi));
    checkedKpisPass.value = JSON.parse(JSON.stringify(updatedKpi));
})
</script>
<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent class="max-w-[40rem] text-sm" @interact-outside="e => e.preventDefault()">
            <DialogHeader>
                <DialogTitle>Task Inspection</DialogTitle>
                <DialogDescription>View task details and mark it as pass or fail.</DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
                <div v-if="task"
                    class=" shadow-sm flex flex-wrap flex-col md:max-h-[9rem] border rounded-md p-4 [&>*:nth-child(even)]:mb-2 [&>*:nth-child(even)]:font-medium [&>*:nth-child(odd)]:text-muted-foreground">
                    <span>UUID:</span> <span class="uppercase">{{ task.task_plan_id }}</span>

                    <span>Product SKU:</span> <span>{{ task.sku }}</span>

                    <span>Planned start date:</span> <span>{{ formatReadableDate(task.can_accessed_at) }}</span>

                    <span>Required manpower:</span> <span>{{ task.manpower }}</span>

                    <template v-if="task.qc_failed_at">
                        <span>Already failed on:</span> <span>{{ formatReadableDate(task.qc_failed_at) }}</span>
                    </template>
                </div>

                <Tabs :default-value="verdict" class="">
                    <TabsList class="w-full">
                        <TabsTrigger value="pass" class="grow">
                            Pass
                        </TabsTrigger>
                        <TabsTrigger value="fail" class="grow">
                            Fail
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="pass">
                        <QcKpiChecklist v-model:checked="checkedKpisPass"
                            description="Carefully check if the item meets all the criteria below." verdict="pass"
                            :loading="loading" @submit="handleQCEvaluate" />
                    </TabsContent>
                    <TabsContent value="fail">
                        <QcKpiChecklist v-model:checked="checkedKpisFail"
                            description="Deselect all criteria that do not meet the quality requirements and add comment if necessary."
                            :loading="loading" verdict="fail" @submit="handleQCEvaluate" />
                    </TabsContent>
                </Tabs>
            </div>
        </DialogScrollContent>

        <ConfirmationDialog v-model="showConfirmationDialog" @yes="handleSubmit" title="Confirmation"
            description="Please read before proceeding">
            <p>Make sure you have thoroughly checked the item to avoid mistakes. Are you sure you want to proceed?</p>
        </ConfirmationDialog>
    </Dialog>
</template>



<style scoped></style>