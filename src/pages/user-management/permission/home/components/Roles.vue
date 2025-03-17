<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import RolesDataTable from './RolesDataTable.vue';
import { ref } from 'vue';
import type { Role } from '@/types/auth';
import { ButtonApp } from '@/components/app/button';
import { Plus } from 'lucide-vue-next';

const authStore = useAuthStore()
const { fetchRoles, roles } = useRoles()

function useRoles() {
    const roles = ref<Role[]>()
    const showRolesDialog = ref(false)
    const showRolesEditDialog = ref(false)
    const selecteRole = ref<Role>()


    async function fetchRoles() {
        roles.value = await authStore.getRoles()
    }

    function handleShowRoleDialog() {
        showRolesDialog.value = true
    }

    function handleShowRoleEditDialog(Role: Role) {
        showRolesEditDialog.value = true
        selecteRole.value = Role
    }

    async function handleRoleCreateSubmit(payload: RolePayload) {
        await authStore.addRole(payload);

        if (!authErrors.value) {
            await fetchRoles()
            toast.info('Role info', {
                description: 'Role successfully added.'
            })
        } else {
            toast.error('Role error', {
                description: 'Something went wrong while creating the Role.'
            })
        }
    }

    async function handleRoleUpdateSubmit(payload: RolePayload) {

        if (!selecteRole.value) {
            console.warn('no Role selected')
            return;
        }

        await authStore.updateRole(selecteRole.value.id, payload);

        if (!authErrors.value) {
            await fetchRoles()
            toast.info('Role info', {
                description: 'Role successfully updated.'
            })
        } else {
            toast.error('Role error', {
                description: 'Something went wrong while updating the Role.'
            })
        }
    }

    async function handleRoleDeleteSubmit(Role: Role) {
        await authStore.deleteRole(Role.id)

        if (!authErrors.value) {
            await fetchRoles()
            toast.info('Role info', {
                description: 'Role successfully deleted.'
            })
        } else {
            toast.error('Role error', {
                description: 'Something went wrong while deleting the permission.'
            })
        }
    }

    return {
        fetchRoles,
        roles
    }
}

await fetchRoles()
</script>
<template>
    <Card class="p-4">
        <ButtonApp :prepend-icon="Plus" @click="handleShowPermissionDialog">Create permission</ButtonApp>
        <RolesDataTable v-if="roles" :roles="roles">

        </RolesDataTable>
    </Card>
</template>



<style scoped></style>