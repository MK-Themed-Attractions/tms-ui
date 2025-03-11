<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import { Building } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';


const workerDepartmentStore = useWorkerDepartmentStore()
const { departments } = storeToRefs(workerDepartmentStore)
const selectedDepartment = defineModel<string>()

if (!departments.value) {
    await workerDepartmentStore.getDepartments()
}
</script>
<template>
    <Select v-model="selectedDepartment">
        <SelectTrigger class="gap-2">
            <Building class="size-4" />
            <SelectValue placeholder="Select a department..." class="mr-auto"></SelectValue>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>Departments</SelectLabel>
                <SelectSeparator />
                <SelectItem v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>



<style scoped></style>