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
import type { KPIPayload } from '@/types/qc';
import { computed } from 'vue';
import KPIFormCodes from './KPIFormCodes.vue';


const emits = defineEmits<{
    (e: 'submit', payload: KPIPayload): void
}>()
const props = defineProps<{
    loading?: boolean
}>()

const formSchema = toTypedSchema(
    z.object({
        title: z.string().nonempty("Required"),
        description: z.string().nonempty('Required'),
        is_default: z.boolean(),
        codes: z.array(z.string()).optional()
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
const { handleSubmit, handleReset, values } = useForm({
    validationSchema: formSchema,
    initialValues: {
        is_default: true
    }
})

const isDefault = computed(() => values.is_default)

const submit = handleSubmit((values) => {
    emits('submit', values)
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