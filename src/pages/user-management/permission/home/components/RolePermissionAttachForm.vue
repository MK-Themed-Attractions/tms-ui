<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Permission, PermissionAttachPayload, Role } from '@/types/auth';
import type { RoutingMicroserviceType } from '@/microservice';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import RolePermissionAttachSelectInput from './RolePermissionAttachSelectInput.vue';
import { ButtonApp } from '@/components/app/button';
import { useAuthStore } from '@/stores/authStore';
import { computed, ref } from 'vue';

const props = defineProps<{
    role: Role,
    loading?: boolean
}>()
const emits = defineEmits<{
    (e: 'submit', payload: PermissionAttachPayload): void
}>()

const formSchema = toTypedSchema(z.object({
    role_id: z.string().nonempty('Required'),
    microservices: z.array(z.object({
        name: z.custom<RoutingMicroserviceType>(),
        permissions: z.array(z.string()).nonempty('All fields are required.')
    }))
}))
const authStore = useAuthStore()
const { fetchPermissions, permissions } = usePermission()
const { fetchRolepermissions, roleWithPermissions, rolePermissionsToForm } = useRole()


const { handleSubmit, errors } = useForm({
    validationSchema: formSchema,
    initialValues: {
        role_id: props.role.id,
    }
})

const submit = handleSubmit((values) => {
    emits('submit', values)
})

function usePermission() {
    const permissions = ref<Permission[]>()

    async function fetchPermissions() {
        permissions.value = await authStore.getPermissions()
    }
    return {
        permissions,
        fetchPermissions,
    }
}

function useRole() {
    const roleWithPermissions = ref<Role>()

    const rolePermissionsToForm = computed(() => {
        return roleWithPermissions.value?.role_permissions?.map((rp) => {
            return {
                name: rp.microservice,
                permissions: rp.permissions.reduce<string[]>((acc, p) => {
                    acc.push(p.id)
                    return acc;
                }, [])
            }
        })
    })

    async function fetchRolepermissions() {
        const data = await authStore.getRolePermissions(props.role.id)
        roleWithPermissions.value = data;
    }

    return {
        fetchRolepermissions,
        rolePermissionsToForm,
        roleWithPermissions
    }

}


/* INIT */
if (!permissions.value) {
    await fetchPermissions()
}
if (!roleWithPermissions.value) {
    await fetchRolepermissions()
}

</script>

<template>
    <form @submit="submit" class="space-y-4">
        <FormField #="{ componentField }" name="microservices">
            <FormItem>
                <FormLabel>Microservices and permissions</FormLabel>
                <FormControl>
                    <RolePermissionAttachSelectInput v-if="permissions" v-bind="componentField"
                        :role-permissions="rolePermissionsToForm" :permissions="permissions" />
                </FormControl>
                <FormMessage class="text-center" />
            </FormItem>
        </FormField>
        <ButtonApp type="submit" :disabled="Object.keys(errors).length || loading" :loading="loading">Attach</ButtonApp>
    </form>
</template>


<style scoped></style>