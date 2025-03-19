<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';
import type { Role, User, UserRole } from '@/types/auth';
import { toTypedSchema } from '@vee-validate/zod';
import { Link, } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { z } from 'zod';
import type { UserDialogRoleAttachSubmit } from '..';

const props = defineProps<{
    user: User
    onSubmit: UserDialogRoleAttachSubmit,
    loading?: boolean
}>()
const formSchema = toTypedSchema(z.object({
    roles: z.string()
}))

const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema
})
const submit = handleSubmit((values) => {
    const payload = { roles: [values.roles] }

    props.onSubmit(props.user.id, payload, (success: boolean) => {
    });

})
const { fetchRoles, roles, getUserRole, userRole } = useRole()

function useRole() {
    const authStore = useAuthStore()
    const roles = ref<Role[]>()
    const userRole = ref<Role>()

    async function fetchRoles() {
        const data = await authStore.getRoles()
        roles.value = data;
    }

    async function getUserRole() {
        const data = await authStore.getUserRole(props.user.id)
        userRole.value = data;
    }

    return {
        roles,
        fetchRoles,
        getUserRole,
        userRole
    }
}

/* INIT */
if (!roles.value) {
    await fetchRoles()
}

await getUserRole()
if (userRole.value) {
    setFieldValue('roles', userRole.value.id)
}

</script>
<template>
    <form @submit="submit">
        <FormField #="{ componentField }" name="roles">
            <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                    <Select v-bind="componentField">
                        <SelectTrigger>
                            <SelectValue placeholder="select a role..." class="capitalize"></SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                <SelectItem v-for="role in roles" :key="role.id" :value="role.id" class="capitalize">{{
                                    role.name }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <div class="mt-4">
            <ButtonApp type="submit" :prepend-icon="Link" :loading="loading">Attach Role
            </ButtonApp>
        </div>
    </form>
</template>



<style scoped></style>