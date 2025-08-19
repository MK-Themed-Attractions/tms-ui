<script setup lang="ts">
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import TicketFormTicketTypeSelect from './TicketFormTicketTypeSelect.vue';
import { ButtonApp } from '@/components/app/button';
import { ticketSchema, type TicketSchema } from '@/types/ticket';
import { Skeleton } from '@/components/ui/skeleton';


const emits = defineEmits<{
    (e: 'submit', data: TicketSchema): void
}>()

const props = defineProps<{
    loading?: boolean
    initialValues?: Partial<TicketSchema>
}>()


const formSchema = toTypedSchema(ticketSchema)

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: props.initialValues,
})

const submit = handleSubmit(async (values) => {
    emits('submit', values);
})

</script>


<template>
    <form @submit="submit" class="space-y-4">
        <FormField #="{ componentField }" name="ticket_type_id">
            <FormItem>
                <FormLabel>Ticket Type</FormLabel>
                <FormControl>
                    <Suspense>
                        <TicketFormTicketTypeSelect v-bind="componentField" :disabled="loading" />
                        <template #fallback>
                            <Skeleton class="h-10" />
                        </template>
                    </Suspense>
                </FormControl>
                <FormDescription>Choose the appropriate type of the ticket you want to report</FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField #="{ componentField }" name="title">
            <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input v-bind="componentField" :disabled="loading" />
                </FormControl>
                <FormDescription>Title of the ticket</FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField #="{ componentField }" name="details">
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea v-bind="componentField" :disabled="loading" />
                </FormControl>
                <FormDescription>Detailed description about the incident</FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <ButtonApp :disabled="loading" :loading="loading" type="submit">Submit Ticket</ButtonApp>
    </form>
</template>


<style scoped></style>