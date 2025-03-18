<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import RolesDataTable from './RolesDataTable.vue';
import { ref } from 'vue';
import type { PermissionAttachPayload, Role, RolePayload } from '@/types/auth';
import { ButtonApp } from '@/components/app/button';
import { Plus, Shield } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import RolesDialog from './RolesDialog.vue';
import RolesForm from './RolesForm.vue';
import RolesDataTableDropdown from './RolesDataTableDropdown.vue';
import { EmptyResource } from '@/components/app/empty-resource';
import RolesPermissionAttachDialog from './RolesPermissionAttachDialog.vue';
import RolePermissionAttachForm from './RolePermissionAttachForm.vue';


const authStore = useAuthStore()
const { errors: authErrors, loading: authLoading } = storeToRefs(authStore)
const { fetchRoles,
    roles,
    selectedRole,
    handleRoleCreateSubmit,
    handleRoleDeleteSubmit,
    handleRoleUpdateSubmit,
    handleShowRoleDialog,
    handleShowRoleEditDialog,
    showRolesDialog,
    showRolesEditDialog,
} = useRoles()

const { handleShowRolePermissionAttachDialog,
    showRolesPermissionAttachDialog,
    handlePermissionAttachSubmit } = usePermissions()

function useRoles() {
    const roles = ref<Role[]>()
    const showRolesDialog = ref(false)
    const showRolesEditDialog = ref(false)

    const selectedRole = ref<Role>()

    function handleShowRoleDialog() {
        showRolesDialog.value = true
    }

    function handleShowRoleEditDialog(role: Role) {
        showRolesEditDialog.value = true
        selectedRole.value = role
    }

    async function fetchRoles() {
        roles.value = await authStore.getRoles()
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

        if (!selectedRole.value) {
            console.warn('no Role selected')
            return;
        }

        await authStore.updateRole(selectedRole.value.id, payload);

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
        roles,
        selectedRole,
        showRolesDialog,
        showRolesEditDialog,
        handleShowRoleDialog,
        handleShowRoleEditDialog,
        handleRoleCreateSubmit,
        handleRoleUpdateSubmit,
        handleRoleDeleteSubmit
    }
}

function usePermissions() {
    const showRolesPermissionAttachDialog = ref(false)


    function handleShowRolePermissionAttachDialog(role: Role) {
        showRolesPermissionAttachDialog.value = true;
        selectedRole.value = role;
    }

    async function handlePermissionAttachSubmit(payload: PermissionAttachPayload) {
        await authStore.attachPermissions(payload);
    }

    return {
        showRolesPermissionAttachDialog,
        handleShowRolePermissionAttachDialog,
        handlePermissionAttachSubmit
    }

}

await fetchRoles()
</script>
<template>
    <Card class="p-4 space-y-4">
        <ButtonApp :prepend-icon="Plus" @click="handleShowRoleDialog">Create permission</ButtonApp>
        <RolesDataTable v-if="roles && roles.length" :roles="roles">
            <template #actions="{ item }">
                <RolesDataTableDropdown @edit="handleShowRoleEditDialog(item)" @delete="handleRoleDeleteSubmit(item)"
                    @attach="handleShowRolePermissionAttachDialog(item)" />
            </template>
        </RolesDataTable>
        <EmptyResource v-else :icon="Shield" title="No role found"
            description="You start viewing roles as soon as you add one.">
            <ButtonApp class="w-fit mx-auto mt-4" :prepend-icon="Plus" @click="handleShowRoleDialog">Create
                Role</ButtonApp>
        </EmptyResource>


        <!-- Creating Role -->
        <RolesDialog v-model="showRolesDialog">
            <RolesForm :loading="authLoading" @submit="handleRoleCreateSubmit" />
        </RolesDialog>

        <!-- Updating Role -->
        <RolesDialog v-model="showRolesEditDialog">
            <RolesForm :loading="authLoading" @submit="handleRoleUpdateSubmit" mode="edit" :role="selectedRole" />
        </RolesDialog>

        <!-- Role attchment -->
        <RolesPermissionAttachDialog v-model="showRolesPermissionAttachDialog" v-if="selectedRole">
            <RolePermissionAttachForm :role="selectedRole" @submit="handlePermissionAttachSubmit"
                :loading="authLoading" />
        </RolesPermissionAttachDialog>
    </Card>
</template>



<style scoped></style>