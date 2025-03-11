<script setup lang="ts">
import { TableCell } from '@/components/ui/table';
import KPIDataTable from './components/KPIDataTable.vue';
import { Ellipsis, Plus } from 'lucide-vue-next';
import { ButtonApp } from '@/components/app/button';
import KPIFormDialog from './components/KPIFormDialog.vue';
import { ref } from 'vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import KPIDeptDataTable from './components/KPIDeptDataTable.vue';
import { useQcStore } from '@/stores/qcStore';
import type { KPI, KPIPayload } from '@/types/qc';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';

const route = useRoute()
const { handleFormSubmit, handleDeptFormSubmit, selectedKpi, handleEditKpi, handleFormEditSubmit, handleDeptEditFormSubmit, handleDeptEditKpi, handleGetKpiOnDeptMode } = useKPI()
const selectedDepartmentId = ref<string>()
const showEditDialog = ref(false)
const showDeptEditDialog = ref(false)

function useKPI() {
    const qcStore = useQcStore()
    const selectedKpi = ref<KPI>()
    const workerDepartmentStore = useWorkerDepartmentStore()
    const { errors } = storeToRefs(qcStore)

    async function handleFormSubmit(payload: KPIPayload, callback: (res: boolean) => Promise<void>) {
        await qcStore.addKpi(payload)
        const success = !errors.value ? true : false
        await callback(success);

        if (success) {
            await qcStore.getKPIs(route.query)
        }
    }

    async function handleDeptFormSubmit(payload: KPIPayload, callback: (res: boolean) => Promise<void>) {
        await qcStore.addKpi(payload)
        const success = !errors.value ? true : false
        await callback(success);

        if (success && selectedDepartmentId.value) {
            const workCenters = workerDepartmentStore.getWorkCentersByDeptId(selectedDepartmentId.value)
            await qcStore.getDepartmentKPIs({ codes: workCenters })
        }
    }

    async function handleFormEditSubmit(payload: KPIPayload, callback: (res: boolean) => Promise<void>) {
        if (!selectedKpi.value) return;

        await qcStore.editKpi(selectedKpi.value.id, payload)
        const success = !errors.value ? true : false
        await callback(success);

        if (success) {
            await qcStore.getKPIs(route.query)
        }
    }

    async function handleDeptEditFormSubmit(payload: KPIPayload, callback: (res: boolean) => Promise<void>) {
        if (!selectedKpi.value) return;

        await qcStore.editKpi(selectedKpi.value.id, payload)
        const success = !errors.value ? true : false
        await callback(success);

        if (success && selectedDepartmentId.value) {
            const workCenters = workerDepartmentStore.getWorkCentersByDeptId(selectedDepartmentId.value)
            await qcStore.getDepartmentKPIs({ codes: workCenters })
        }
    }

    function handleEditKpi(kpi: KPI) {
        console.log(kpi)
        selectedKpi.value = kpi
        showEditDialog.value = true;
    }

    function getWorkCentersByDepartment() {
        if (selectedDepartmentId.value) {
            // Get work center codes associated with the selected department
            const workCenters = workerDepartmentStore.getWorkCentersByDeptId(selectedDepartmentId.value);

            // Initialize an array to store work center details
            const workCenterList: { department: string; id: string }[] = [];

            // Loop through each work center and fetch its details
            workCenters?.forEach(workCenter => {
                // Get work center details as {id: string, department: string}
                const workCenterInfo = workerDepartmentStore.getDepartmentCodeIdByWorkCenter(workCenter);

                // Add the work center info to the array if it's valid
                if (workCenterInfo) {
                    workCenterList.push(workCenterInfo);
                }
            });
            return workCenterList;
        }
    }

    function handleDeptEditKpi(kpi: KPI) {
        selectedKpi.value = kpi
        selectedKpi.value.departments = []
        selectedKpi.value.departments = getWorkCentersByDepartment()

        showDeptEditDialog.value = true;
    }


    function handleGetKpiOnDeptMode() {
        const newKpi = ref<KPI>({
            is_default: false,
            departments: [],
            title: '',
            description: '',
            id: ''
        })
        if (getWorkCentersByDepartment())
            newKpi.value.departments = getWorkCentersByDepartment()

        return newKpi.value
    }


    return {
        handleFormSubmit,
        handleDeptFormSubmit,
        handleFormEditSubmit,
        handleDeptEditKpi,
        handleDeptEditFormSubmit,
        handleGetKpiOnDeptMode,
        selectedKpi,
        handleEditKpi
    }
}
</script>
<template>
    <div class="space-y-6 container">
        <div>
            <h1 class="text-lg font-semibold md:text-2xl">Key performance indicator</h1>
            <p class="text-muted-foreground">
                Define and manage Key Performance Indicators (KPIs) by adding, editing, deleting, and assigning them to
                specific departments. This helps ensure clear performance tracking and quality standards across
                different areas.
            </p>
        </div>

        <Tabs default-value="all">
            <TabsList class="w-full *:grow">
                <TabsTrigger value="all">
                    All
                </TabsTrigger>
                <TabsTrigger value="department">
                    Department specific KPIs
                </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
                <Card class="space-y-4 p-4">
                    <KPIFormDialog @submit="handleFormSubmit">
                        <ButtonApp :prepend-icon="Plus">Add KPI</ButtonApp>
                    </KPIFormDialog>
                    <div class="border rounded-md overflow-hidden">
                        <KPIDataTable>
                            <template #actions="{ item }">
                                <TableCell>
                                    <ButtonApp class="size-6 group-hover:visible invisible" size="icon" variant="non"
                                        @click="handleEditKpi(item)">
                                        <Ellipsis class="size-4" />
                                    </ButtonApp>
                                </TableCell>
                            </template>
                        </KPIDataTable>
                    </div>
                </Card>
                <KPIFormDialog v-if="selectedKpi" v-model="showEditDialog" mode="edit" :kpi="selectedKpi"
                    @submit="handleFormEditSubmit"></KPIFormDialog>
            </TabsContent>
            <TabsContent value="department">
                <Card class="space-y-4 p-4">
                    <KPIFormDialog @submit="handleDeptFormSubmit" :kpi="handleGetKpiOnDeptMode()" mode="edit">
                        <ButtonApp :prepend-icon="Plus">Add KPI</ButtonApp>
                    </KPIFormDialog>
                    <KPIDeptDataTable v-model:selecteddepartment="selectedDepartmentId">
                        <template #actions="{ item }">
                            <TableCell>
                                <ButtonApp class="size-6 group-hover:visible invisible" size="icon" variant="non"
                                    @click="handleDeptEditKpi(item)">
                                    <Ellipsis class="size-4" />
                                </ButtonApp>
                            </TableCell>
                        </template>
                    </KPIDeptDataTable>
                </Card>

                <KPIFormDialog v-if="selectedKpi" v-model="showDeptEditDialog" mode="edit" :kpi="selectedKpi"
                    @submit="handleDeptEditFormSubmit"></KPIFormDialog>
            </TabsContent>
        </Tabs>
    </div>
</template>



<style scoped></style>