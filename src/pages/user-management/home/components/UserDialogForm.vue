<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import type { UserPayload } from '@/types/auth';
import type { UserDialogFormSubmit } from '..';


const props = defineProps<{
    onSubmit: UserDialogFormSubmit,
    loading?: boolean
}>()
const formSchema = toTypedSchema(z.object({
    mail: z.string().email().nonempty('required'),
    password: z.string().min(8, 'Password must contain at least 8 character(s)'),
    given_name: z.string().nonempty('required'),
    last_name: z.string().nonempty('required')
}))


const { handleSubmit, errors: formErrors, handleReset } = useForm({
    validationSchema: formSchema,
})

const submit = handleSubmit((values) => {
    props.onSubmit(values, (success: boolean) => {
        if (success)
            handleReset()
    });
})
</script>
<template>
    <form @submit="submit" class="grid gap-4 lg:grid-cols-2">
        <FormField #="{ componentField }" name="mail">
            <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input type="email" v-bind="componentField" />
                </FormControl>
                <FormMessage></FormMessage>
                <FormDescription>Email must be a valid email and unique</FormDescription>
            </FormItem>
        </FormField>
        <FormField #="{ componentField }" name="password">
            <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" v-bind="componentField" />
                </FormControl>
                <FormMessage></FormMessage>
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
            Create</ButtonApp>
    </form>
</template>



<style scoped></style>