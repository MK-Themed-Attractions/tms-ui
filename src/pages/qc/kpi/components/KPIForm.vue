<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import { Input } from '@/components/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import KPIFormCheckbox from './KPIFormCheckbox.vue';
import { Textarea } from '@/components/ui/textarea';
import { ButtonApp } from '@/components/app/button';
import type { KPI, KPIPayload } from '@/types/qc';
import { computed } from 'vue';
import KPIFormCodes from './KPIFormCodes.vue';
import type { WorkerDepartment } from '@/types/workers';
import { useWorkerDepartmentStore } from '@/stores/workerDepartmentStore';
import { storeToRefs } from 'pinia';


const emits = defineEmits<{
    (e: 'submit', payload: KPIPayload): void
}>()
const props = defineProps<{
    loading?: boolean
    defaults?: KPI
}>()

const formSchema = toTypedSchema(
    z.object({
        title: z.string().nonempty("Required"),
        description: z.string().nonempty('Required'),
        is_default: z.boolean(),
        codes: z.array(z.custom<WorkerDepartment>()).optional()
    })
        .superRefine((data, ctx) => {
            if (!data.is_default && (!data.codes || data.codes.length === 0)) {
                ctx.addIssue({
                    path: ["codes"],
                    message: "Required when it is not default to all",
                    code: "custom",
                });
            }
        })
);
const workerDepartmentStore = useWorkerDepartmentStore()
const { departments } = storeToRefs(workerDepartmentStore)

if (!departments.value)
    await workerDepartmentStore.getDepartments()

const defaultValues = computed(() => {
    if (!props.defaults) return;
    const defaults = props.defaults;

    const departments = defaults.departments?.reduce<string[]>((acc, d) => {
        acc.push(d.department)
        return acc;
    }, [])

    return {
        title: defaults.title,
        description: defaults.description,
        is_default: defaults.is_default,
        codes: workerDepartmentStore.getDepartmentByWorkCenters(departments || [])
    }
})
const { handleSubmit, handleReset, values } = useForm({
    validationSchema: formSchema,
    initialValues: defaultValues.value || {
        is_default: true,
        codes: []
    }
})

const isDefault = computed(() => values.is_default)

const submit = handleSubmit((values) => {
    //transform the codes to only include the work centers as an array
    const workCenters = values.codes?.reduce<string[]>((acc, dept) => {
        acc.push(...dept.work_centers)
        return acc;
    }, [])

    emits('submit', {
        is_default: values.is_default,
        title: values.title,
        description: values.description,
        codes: workCenters
    })
    handleReset()
})

</script>
<template>
    <form @submit="submit">
        <FormField #default="{ componentField }" name="title">
            <FormItem>
                <FormLabel class="relative after:content-['*'] after:text-rose-500">Title</FormLabel>
                <FormControl>
                    <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField #default="{ componentField }" name="description">
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField #default="{ componentField }" name="is_default">
            <FormItem class="mt-4">
                <FormControl>
                    <KPIFormCheckbox v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField #default="{ componentField }" name="codes" v-if="!isDefault">
            <FormItem class="mt-4">
                <FormControl>
                    <KPIFormCodes v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <div class="mt-4">
            <ButtonApp type="submit" :loading="loading">Submit</ButtonApp>
        </div>
    </form>
</template>



<style scoped></style>