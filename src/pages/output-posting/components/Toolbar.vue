<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import { Building, LoaderCircle } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import type { WorkerDepartment } from '@/types/workers';
import { cn } from '@/lib/utils';

import { usePermission } from "@/layouts/main/usePermission";
const { hasPermission } = usePermission();
const OUTPUT_POSTING_TO_BC_KEY = import.meta.env.VITE_OUTPUT_POSTING_TO_BC_KEY;

defineOptions({
    inheritAttrs: false
})
const workerDepartmentStore = useWorkerDepartmentStore()
const emits = defineEmits<{
    (e: "change", department: WorkerDepartment): void;
    (e: "reset"): void;
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

        if (newValue === 'all') {
          emits("reset");
          return;
        }

        const department = departments.value.find(d => d.id === newValue)

        if (department) emits("change", department);
    });

    return {
        departments,
        fetchDepartments
    }
}

watch(departments, (newDepartments) => {
    if (hasPermission(OUTPUT_POSTING_TO_BC_KEY)) {
      selectedDepartmentId.value = 'all'
      return
    }

    selectedDepartmentId.value = newDepartments?.[0]?.id ?? ''
}, { immediate: true })

/* INITIALIZATION */
if (!departments.value) {
    await fetchDepartments()
}
</script>

<template>
    <div :class="cn('rounded-md border p-4 shadow-sm', $attrs['class'] as string)">
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
                        <SelectItem v-if="hasPermission(OUTPUT_POSTING_TO_BC_KEY)" value="all">All</SelectItem>
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