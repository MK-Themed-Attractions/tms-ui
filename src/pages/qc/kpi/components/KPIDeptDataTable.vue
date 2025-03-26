<script setup lang="ts">
import { useQcStore } from '@/stores/qcStore';
import { storeToRefs } from 'pinia';
import KPIDeptSelect from './KPIDeptSelect.vue';
import { watchEffect } from 'vue';
import { DataTable } from '@/components/app/data-table';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import { kpiDeptDataTableColumns } from '../data';
import { TableCell } from '@/components/ui/table';
import { Building } from 'lucide-vue-next';
import { Loader } from '@/components/app/loader';
import { Card } from '@/components/ui/card';



const qcStore = useQcStore()
const workerDepartmentStore = useWorkerDepartmentStore()
const { departmentKPIsNoDefault, loading } = storeToRefs(qcStore)
const selectedDepartmentId = defineModel<string>('selecteddepartment')


watchEffect(async () => {
    if (!selectedDepartmentId.value) return;
    const workCenters = workerDepartmentStore.getWorkCentersByDeptId(selectedDepartmentId.value)
    await qcStore.getDepartmentKPIs({
        codes: workCenters
    })
})
</script>

<template>
    <div class="space-y-4">
        <Suspense>
            <KPIDeptSelect v-model="selectedDepartmentId" />
            <template #fallback>
                <div class="h-10 bg-muted/50 rounded-md">
                </div>
            </template>
        </Suspense>


        <Card v-for="departmentKpi in departmentKPIsNoDefault" :key="departmentKpi.id"
            v-if="selectedDepartmentId && !loading" class="p-4 space-y-2">
            <div class="flex justify-between items-center">
                <h3 class="font-medium text-sm">Work center: <span class="rounded-md border px-1">{{
                    departmentKpi.department
                        }}</span></h3>
                <slot name="append" :item="departmentKpi">

                </slot>
            </div>
            <DataTable v-if="departmentKpi" :items="departmentKpi.kpi" :columns="kpiDeptDataTableColumns">
                <template #item.description="{ item }">
                    <TableCell>
                        <em>{{ item.description }}</em>
                    </TableCell>
                </template>

                <template #item.actions="{ item }">
                    <slot name="actions" :item="{ kpi: item, departmentKpi }"></slot>
                </template>
            </DataTable>
        </Card>

        <Loader description="Loading KPIs..." v-else-if="loading" class="min-h-[50vh]" />

        <div v-else class=" rounded-md border border-dashed grid place-content-center min-h-[40vh] text-center">
            <Building class="mx-auto" />
            <h2 class="text-2xl font-bold">No department Selected</h2>
            <p class="text-muted-foreground text-sm">Please select a department to display its KPIs.</p>
        </div>
    </div>
</template>



<style scoped></style>