<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import type { WorkerDepartment } from '@/types/workers';
import { Building, LoaderCircle } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { watch, watchEffect } from 'vue';
const props = defineProps<{
    loading?: boolean
}>()

const emits = defineEmits<{
    (e: 'change', department: WorkerDepartment): void
}>()
const selectedDepartmentId = defineModel({ default: '' });


const departmentStore = useWorkerDepartmentStore()
const { departments, loading: departmentLoading } = storeToRefs(departmentStore)

if (!departments.value)
    await departmentStore.getDepartments()

watch(selectedDepartmentId, (newValue) => {
    if (!departments.value) return;

    const department = departments.value.find(d => d.id === newValue)

    if (department) emits("change", department);
});


</script>
<template>
    <Select v-model="selectedDepartmentId">
        <SelectTrigger class="flex-1 basis-[20rem] gap-2" :disabled="loading || departmentLoading">
            <Building class="size-5" />
            <SelectValue placeholder="Select a department..." class="mr-auto"></SelectValue>
            <LoaderCircle v-if="loading || departmentLoading" class="size-5 animate-spin" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>Departments</SelectLabel>
                <SelectItem v-for="department in departments" :key="department.id" :value="department.id"
                    @vue:updated="$emit('change', department)">
                    {{ department.name }}
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>



<style scoped></style>