<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { InputPassword } from '@/components/app/input-password';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import type { UserChangePassPayload } from '@/types/auth';
import { toTypedSchema } from '@vee-validate/zod';
import { AlertCircleIcon } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const emits = defineEmits<{
    (e: 'submit', payload: UserChangePassPayload): void
}>()
const authStore = useAuthStore()
const { errors } = storeToRefs(authStore)

const props = defineProps<{
    loading?: boolean,
    errors?: typeof errors.value
}>()
const dialog = defineModel({ default: false })

const formSchema = toTypedSchema(z.object({
    current_password: z.string().nonempty('Required'),
    new_password: z.string().nonempty('Required')
}))

const { handleSubmit } = useForm({ validationSchema: formSchema })

const submit = handleSubmit((values) => {
    emits('submit', values)
})

</script>
<template>
    <Dialog>
        <DialogTrigger>
            <slot />
        </DialogTrigger>

        <DialogContent @interact-outside="e => e.preventDefault()">
            <DialogHeader>
                <DialogTitle>Change password</DialogTitle>
                <DialogDescription>After changing your password, you will be logged out.</DialogDescription>

                <form class="space-y-4" @submit="submit">
                    <Alert variant="destructive" v-if="errors">
                        <AlertCircleIcon class="size-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{{ errors.data.message }}</AlertDescription>
                    </Alert>

                    <FormField #="{ componentField }" name="current_password">
                        <FormItem>
                            <FormLabel>Current password</FormLabel>
                            <FormControl>
                                <InputPassword v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField #="{ componentField }" name="new_password">
                        <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                                <InputPassword v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <ButtonApp class="w-full" type="submit" :disabled="loading" :loading="loading">Change Password
                    </ButtonApp>
                </form>
            </DialogHeader>
        </DialogContent>
    </Dialog>
</template>


<style scoped></style>