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
import { useSimplePaginate } from '@/composables/usePaginate';
import { MultiSelect } from '@/components/app/multi-select/Index';

const props = defineProps<{
    user: User
    onSubmit: UserDialogRoleAttachSubmit,
    loading?: boolean
}>()
const formSchema = toTypedSchema(z.object({
    roles: z.array(z.string())
}))

const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema
})
const submit = handleSubmit((values) => {
    const payload = values

    props.onSubmit(props.user.id, payload, (success: boolean) => {
    });

})
const { fetchRoles, roles, getUserRole, userRoles } = useRole()

function useRole() {
    const authStore = useAuthStore()
    const { items: roles, paginate } = useSimplePaginate<Role>()
    const userRoles = ref<Role[]>()

    async function fetchRoles() {
        const data = await authStore.getRoles({ pages: '999999' })
        paginate.value = data;
    }

    async function getUserRole() {
        const data = await authStore.getUserRole(props.user.id)
        userRoles.value = data;
    }

    return {
        roles,
        fetchRoles,
        getUserRole,
        userRoles
    }
}

/* INIT */
if (!roles.value) {
    await fetchRoles()
}

await getUserRole()

if (userRoles.value) {
    setFieldValue('roles', userRoles.value.reduce<string[]>((acc, role) => {
        acc.push(role.id)
        return acc;
    }, []))
}

</script>
<template>
    <form @submit="submit">
        <FormField #="{ componentField }" name="roles">
            <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                    <MultiSelect v-if="roles" :items="roles" v-bind="componentField" return-key="id" value-key="name"
                        placeholder="Select roles" :max-display-count="4" class="w-full">
                    </MultiSelect>
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