<script setup lang="ts">
import type { RoutingMicroserviceType } from '@/microservice';
import { useAuthStore } from '@/stores/authStore';
import type { Permission, RolePermission, User } from '@/types/auth';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { z } from 'zod';
import RolePermissionAttachSelectInput from '../../permission/home/components/RolePermissionAttachSelectInput.vue';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ButtonApp } from '@/components/app/button';
import type { UserDialogPermissionAttachSubmit } from '..';
import { computed } from '@vue/reactivity';

const props = defineProps<{
    user: User,
    loading?: boolean,
    onSubmit: UserDialogPermissionAttachSubmit
}>()
const authStore = useAuthStore()
const formSchema = toTypedSchema(z.object({
    microservices: z.array(z.object({
        name: z.custom<RoutingMicroserviceType>(),
        permissions: z.array(z.string())
    }))
}))

const { handleSubmit, errors: formErrors } = useForm({
    validationSchema: formSchema
})

const submit = handleSubmit((values) => {
    props.onSubmit(props.user.id, values)
})
const { fetchUserPermissions, userPermissions, userPermissionsToForm } = useUser()


function useUser() {
    const userPermissions = ref<RolePermission[]>()

    const userPermissionsToForm = computed(() => {
        return userPermissions.value?.map((up) => {
            return {
                name: up.microservice.toLowerCase() as RoutingMicroserviceType,
                permissions: up.permissions.reduce<string[]>((acc, p) => {
                    acc.push(p.id)
                    return acc;
                }, [])
            }
        })
    })
    async function fetchUserPermissions() {
        const data = await authStore.getUserPermissions(props.user.id)
        userPermissions.value = data;
    }

    return {
        userPermissions,
        userPermissionsToForm,
        fetchUserPermissions
    }
}

/* INIT */
if (!userPermissions.value) {
    await fetchUserPermissions()
}
</script>
<template>
    <form @submit="submit" class="space-y-4">
        <FormField #="{ componentField }" name="microservices">
            <FormItem>
                <FormLabel>Microservices and permissions</FormLabel>
                <FormControl>
                    <RolePermissionAttachSelectInput v-bind="componentField"
                        :role-permissions="userPermissionsToForm" />
                </FormControl>
                <FormMessage class="text-center" />
            </FormItem>
        </FormField>
        <ButtonApp type="submit" :disabled="Object.keys(formErrors).length || loading" :loading="loading">Attach
        </ButtonApp>
    </form>
</template>



<style scoped></style>