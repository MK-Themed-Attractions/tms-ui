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
import type { DepartmentKPI, KPI, KPIPayload } from '@/types/qc';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import KpiDropdown from './components/KpiDropdown.vue';
import { ConfirmationDialog } from '@/components/app/confirmation-dialog';
import { toast } from 'vue-sonner';
import { Loader } from '@/components/app/loader';

const route = useRoute()
const { handleFormSubmit,
    handleDeptFormSubmit,
    selectedKpi,
    handleEditKpi,
    handleFormEditSubmit,
    handleDeptEditFormSubmit,
    handleDeptEditKpi,
    handleGetKpiOnDeptMode,
    handleShowConfirmation,
    handleDeleteKpi,
    handleDeptDeleteKpi,
    handleShowDeptConfirmation } = useKPI()

const selectedDepartmentId = ref<string>()
const showEditDialog = ref(false)
const showConfirmDialog = ref(false)
const showDeptEditDialog = ref(false)
const showDeptConfirmDialog = ref(false)

function useKPI() {
    const qcStore = useQcStore()
    const selectedKpi = ref<KPI>()
    const workerDepartmentStore = useWorkerDepartmentStore()
    const { errors } = storeToRefs(qcStore)

    /* for ALL departments */
    async function handleFormSubmit(payload: KPIPayload, callback: (res: boolean) => Promise<void>) {
        await qcStore.addKpi(payload)
        const success = !errors.value ? true : false
        await callback(success);

        if (success) {
            await qcStore.getKPIs(route.query)
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

    async function handleDeleteKpi() {

        if (!selectedKpi.value) return;

        await qcStore.deleteKpi(selectedKpi.value.id)

        if (!errors.value) {
            await qcStore.getKPIs(route.query)

            toast.info('KPI info', {
                description: 'KPI successfully deleted.'
            })
        } else {
            toast.error('KPI error', {
                description: 'Something went wrong while deleting the KPI'
            })
        }
    }
    /* end - for all departments */


    /* for specific department */
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

    async function handleDeptFormSubmit(payload: KPIPayload, callback: (res: boolean) => Promise<void>) {
        await qcStore.addKpi(payload)
        const success = !errors.value ? true : false
        await callback(success);

        if (success && selectedDepartmentId.value) {
            const workCenters = workerDepartmentStore.getWorkCentersByDeptId(selectedDepartmentId.value)
            await qcStore.getDepartmentKPIs({ codes: workCenters })
        }
    }

    async function handleDeptDeleteKpi() {
        if (!selectedKpi.value || !selectedDepartmentId.value) return;

        await qcStore.deleteKpi(selectedKpi.value.id)

        if (!errors.value) {
            const workCenters = workerDepartmentStore.getWorkCentersByDeptId(selectedDepartmentId.value)
            await qcStore.getDepartmentKPIs({ codes: workCenters })
            toast.info('KPI info', {
                description: 'KPI successfully deleted.'
            })
        } else {
            toast.error('KPI error', {
                description: 'Something went wrong while deleting the KPI'
            })
        }
    }
    /* end - for specific department */



    function handleEditKpi(kpi: KPI) {
        selectedKpi.value = kpi
        showEditDialog.value = true;
    }

    function handleDeptEditKpi(kpi: KPI, departmentKpi: DepartmentKPI) {
        selectedKpi.value = kpi
        selectedKpi.value.departments = []
        selectedKpi.value.departments = [{ ...departmentKpi }]

        showDeptEditDialog.value = true;
    }

    function handleGetKpiOnDeptMode(departmentKpi: DepartmentKPI) {
        const newKpi = ref<KPI>({
            is_default: false,
            departments: [],
            title: '',
            description: '',
            id: ''
        })
        newKpi.value.departments = [{ department: departmentKpi.department, id: departmentKpi.id }]

        return newKpi.value
    }

    function handleShowConfirmation(kpi: KPI) {
        selectedKpi.value = kpi;
        showConfirmDialog.value = true
    }

    function handleShowDeptConfirmation(kpi: KPI) {
        selectedKpi.value = kpi;
        showDeptConfirmDialog.value = true
    }

    return {
        handleFormSubmit,
        handleDeptFormSubmit,
        handleFormEditSubmit,
        handleDeptEditKpi,
        handleDeptEditFormSubmit,
        handleGetKpiOnDeptMode,
        handleShowConfirmation,
        handleShowDeptConfirmation,
        handleDeleteKpi,
        selectedKpi,
        handleEditKpi,
        handleDeptDeleteKpi
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
                        <Suspense>
                            <KPIDataTable>
                                <template #actions="{ item }">
                                    <TableCell>
                                        <KpiDropdown @edit="handleEditKpi(item)" @delete="handleShowConfirmation(item)">
                                            <ButtonApp class="size-6 group-hover:visible invisible" size="icon"
                                                variant="ghost">
                                                <Ellipsis class="size-4" />
                                            </ButtonApp>
                                        </KpiDropdown>
                                    </TableCell>
                                </template>
                            </KPIDataTable>

                            <template #fallback>
                                <Loader description="Loading KPI..." class="min-h-[50vh]" />
                            </template>
                        </Suspense>
                    </div>
                </Card>
                <KPIFormDialog v-if="selectedKpi" v-model="showEditDialog" mode="edit" :kpi="selectedKpi"
                    @submit="handleFormEditSubmit"></KPIFormDialog>

                <ConfirmationDialog v-model="showConfirmDialog" @yes="handleDeleteKpi"></ConfirmationDialog>

            </TabsContent>

            <TabsContent value="department">
                <Card class="space-y-4 p-4">
                    <KPIDeptDataTable v-model:selecteddepartment="selectedDepartmentId">
                        <template #append="{ item }">
                            <KPIFormDialog @submit="handleDeptFormSubmit" :kpi="handleGetKpiOnDeptMode(item)"
                                mode="edit">
                                <ButtonApp :prepend-icon="Plus">Add KPI</ButtonApp>
                            </KPIFormDialog>
                        </template>
                        <template #actions="{ item }">
                            <TableCell>
                                <KpiDropdown @edit="handleDeptEditKpi(item.kpi, item.departmentKpi)"
                                    @delete="handleShowDeptConfirmation(item.kpi)">
                                    <ButtonApp class="size-6 group-hover:visible invisible" size="icon" variant="ghost">
                                        <Ellipsis class="size-4" />
                                    </ButtonApp>
                                </KpiDropdown>
                            </TableCell>
                        </template>
                    </KPIDeptDataTable>

                </Card>

                <KPIFormDialog v-if="selectedKpi" v-model="showDeptEditDialog" mode="edit" :kpi="selectedKpi"
                    @submit="handleDeptEditFormSubmit"></KPIFormDialog>

                <ConfirmationDialog v-model="showDeptConfirmDialog" @yes="handleDeptDeleteKpi"></ConfirmationDialog>
            </TabsContent>
        </Tabs>
    </div>
</template>



<style scoped></style>