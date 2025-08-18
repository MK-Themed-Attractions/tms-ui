<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ticketTypeSchema, type TicketTypeSchema } from '@/types/TicketType';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

const props = defineProps<{
    loading?: boolean;
    initialValues?: Partial<TicketTypeSchema>
}>()

const emits = defineEmits<{
    (e: 'submit', data: TicketTypeSchema): void
}>()

const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(ticketTypeSchema),
    initialValues: props.initialValues
})

const submit = handleSubmit((data) => {
    emits('submit', data)
})

</script>

<template>
    <form class="space-y-4" @submit="submit">
        <FormField #="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input v-bind="componentField" />
                </FormControl>
                <FormDescription>This name will appear when creating tickets</FormDescription>
                <FormMessage />
            </FormItem>

        </FormField>
        <FormField #="{ componentField }" name="description">
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea v-bind="componentField" />
                </FormControl>
                <FormDescription>Optional description</FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <ButtonApp :disabled="loading" :loading="loading" type="submit">Submit</ButtonApp>
    </form>
</template>


<style scoped></style>