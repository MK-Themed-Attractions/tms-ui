<script setup lang="ts">
import { FilterApp } from '@/components/app/filter';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import type { WorkerDepartment } from '@/types/workers';
import { storeToRefs } from 'pinia';


const departmentsModel = defineModel<string[]>()
const workerDepartmentStore = useWorkerDepartmentStore()
const { departments } = storeToRefs(workerDepartmentStore)

if (!departments.value) {
    await workerDepartmentStore.getDepartments()
}

function handleSelect(dept: WorkerDepartment[]) {
    const workCenters = dept.reduce<string[]>((acc, d) => {
        acc.push(...d.work_centers)
        return acc;
    }, [])

    departmentsModel.value = JSON.parse(JSON.stringify(workCenters));
}

function handleClear() {
    departmentsModel.value = []
}
</script>

<template>
    <FilterApp v-if="departments" :items="departments" text="Departments" @select="handleSelect"
        @clear-select="handleClear">
    </FilterApp>
</template>



<style scoped></style>