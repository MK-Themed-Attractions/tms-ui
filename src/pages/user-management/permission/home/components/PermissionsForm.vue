<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Permission, PermissionPayload } from '@/types/auth';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { computed } from 'vue';

import { z } from 'zod';


const props = withDefaults(defineProps<{
    mode?: 'add' | 'edit',
    permission?: Permission
    loading?: boolean
}>(), {
    mode: 'add'
})
const emits = defineEmits<{
    (e: 'submit', payload: PermissionPayload): void
}>()

const formSchema = toTypedSchema(z.object({
    name: z.string().nonempty('Required'),
    description: z.string().nonempty('Required')
}))

/* for editiing */
const initialValues = computed(() => {
    if (!props.permission) return {}

    return {
        name: props.permission.name,
        description: props.permission.description
    }
})

const { handleSubmit, errors: formErrors, resetForm } = useForm({
    validationSchema: formSchema,
    initialValues: initialValues.value
})

const submit = handleSubmit((values) => {
    emits('submit', values)
    resetForm()
})


</script>
<template>
    <form @submit="submit" class="space-y-4">
        <FormField #default="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Key</FormLabel>
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

        <ButtonApp :disabled="Object.keys(formErrors).length || loading" :loading="loading" type="submit">Create
        </ButtonApp>
    </form>
</template>


<style scoped></style>