<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import type { User } from '@/types/auth';
import type { UserDialogFormSubmitWithId } from '..';
import { computed } from 'vue';


const props = defineProps<{
    onSubmit: UserDialogFormSubmitWithId,
    initialValues: User,
    loading?: boolean
}>()
const formSchema = toTypedSchema(z.object({
    mail: z.string().email().nonempty('required'),
    given_name: z.string().nonempty('required'),
    last_name: z.string().nonempty('required')
}))

const initialValues = computed(() => {
    return {
        mail: props.initialValues.email,
        given_name: props.initialValues.given_name,
        last_name: props.initialValues.last_name
    }
})
const { handleSubmit, errors: formErrors, handleReset } = useForm({
    validationSchema: formSchema,
    initialValues: initialValues.value
})

const submit = handleSubmit((values) => {
    props.onSubmit(props.initialValues.id, values, (success: boolean) => {

    });
})
</script>
<template>
    <form @submit="submit" class="grid gap-4 lg:grid-cols-2">
        <FormField #="{ componentField }" name="mail">
            <FormItem class="col-span-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input type="email" v-bind="componentField" />
                </FormControl>
                <FormMessage></FormMessage>
                <FormDescription>Email must be a valid email and unique</FormDescription>
            </FormItem>
        </FormField>
        <FormField #="{ componentField }" name="given_name">
            <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                    <Input v-bind="componentField" />
                </FormControl>
                <FormMessage></FormMessage>
            </FormItem>
        </FormField>
        <FormField #="{ componentField }" name="last_name">
            <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                    <Input v-bind="componentField" />
                </FormControl>
                <FormMessage></FormMessage>
            </FormItem>
        </FormField>

        <ButtonApp type="submit" :disabled="Object.keys(formErrors).length || loading" :loading="loading"
            class="mt-2 col-span-full">
            Update</ButtonApp>
    </form>
</template>



<style scoped></style>