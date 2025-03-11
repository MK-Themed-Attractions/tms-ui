<script setup lang="ts">
import { FilterApp } from '@/components/app/filter';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import type { WorkerDepartment } from '@/types/workers';
import { storeToRefs } from 'pinia';


const departmentsModel = defineModel<WorkerDepartment[]>({ default: [] })
const workerDepartmentStore = useWorkerDepartmentStore()
const { departments } = storeToRefs(workerDepartmentStore)


if (!departments.value) {
    await workerDepartmentStore.getDepartments()
}

</script>

<template>
    <FilterApp v-if="departments" :items="departments" text="Departments" v-model="departmentsModel">
    </FilterApp>
</template>



<style scoped></style>