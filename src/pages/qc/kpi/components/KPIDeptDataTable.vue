<script setup lang="ts">
import { useQcStore } from '@/stores/qcStore';
import { storeToRefs } from 'pinia';
import KPIDeptSelect from './KPIDeptSelect.vue';
import { ref, watchEffect } from 'vue';
import { DataTable } from '@/components/app/data-table';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import { kpiDeptDataTableColumns } from '../data';
import { TableCell } from '@/components/ui/table';
import { Building } from 'lucide-vue-next';


const qcStore = useQcStore()
const workerDepartmentStore = useWorkerDepartmentStore()
const { departmentKPIsNoDefault } = storeToRefs(qcStore)
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
        <KPIDeptSelect v-model="selectedDepartmentId" />
        <div class="flex flex-wrap gap-4" v-if="selectedDepartmentId">
            <template v-for="dept in departmentKPIsNoDefault" :key="dept.id">
                <div class="rounded-md border overflow-hidden basis-[30rem] grow">
                    <h4 class="font-medium text-center">{{ dept.department }}</h4>
                    <DataTable :items="dept.kpi" :columns="kpiDeptDataTableColumns">
                        <template #item.description="{ item }">
                            <TableCell>
                                <em>{{ item.description }}</em>
                            </TableCell>
                        </template>

                        <template #item.actions="{ item }">
                            <slot name="actions" :item="item"></slot>
                        </template>
                    </DataTable>
                </div>
            </template>
        </div>
        <div v-else class=" rounded-md border border-dashed grid place-content-center min-h-[40vh] text-center">
            <Building class="mx-auto" />
            <h2 class="text-2xl font-bold">No department Selected</h2>
            <p class="text-muted-foreground text-sm">Please select a department to display its KPIs.</p>
        </div>
    </div>
</template>



<style scoped></style>