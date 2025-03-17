<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Permission } from '@/types/auth';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { z } from 'zod';


const props = defineProps<{
    mode: 'add' | 'edit',
    permission: Permission
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

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: initialValues.value
})

const submit = handleSubmit((values) => {

})

</script>
<template>
    <form @submit="submit">
        <FormField #default="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                    <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
    </form>
</template>


<style scoped></style>