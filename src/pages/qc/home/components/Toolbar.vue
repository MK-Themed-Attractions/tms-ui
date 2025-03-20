<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import { Building, LoaderCircle } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import type { WorkerDepartment } from '@/types/workers';

const workerDepartmentStore = useWorkerDepartmentStore()
const emits = defineEmits<{
    (e: "change", department: WorkerDepartment): void;
}>();
const props = defineProps<{
    loading?: boolean
}>()
const selectedDepartment = defineModel<WorkerDepartment>()

const selectedDepartmentId = ref<string>()

const { departments, fetchDepartments } = useDepartment()

function useDepartment() {

    const { departments } = storeToRefs(workerDepartmentStore)

    async function fetchDepartments() {
        await workerDepartmentStore.getDepartments()
    }

    watch(selectedDepartmentId, (newValue) => {
        if (!departments.value) return;

        const department = departments.value.find(d => d.id === newValue)

        if (department) emits("change", department);
    });

    return {
        departments,
        fetchDepartments
    }
}

/* INITIALIZATION */
if (!departments.value) {
    await fetchDepartments()
}
</script>

<template>
    <div class="rounded-md border p-4 shadow-sm">
        <div class="flex flex-wrap gap-4">
            <Select v-model="selectedDepartmentId">
                <SelectTrigger class="flex-1 basis-[20rem] gap-2" :disabled="loading">
                    <Building class="size-5" />
                    <SelectValue placeholder="Select a department..." class="mr-auto"></SelectValue>
                    <LoaderCircle v-if="loading" class="size-5 animate-spin" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Departments</SelectLabel>
                        <SelectItem v-for="department in departments" :key="department.id" :value="department.id">{{
                            department.name
                        }}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <slot name="append">

            </slot>
        </div>
    </div>
</template>


<style scoped></style>