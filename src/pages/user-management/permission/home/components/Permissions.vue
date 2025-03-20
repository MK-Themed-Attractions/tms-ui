<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import PermissionsDataTable from './PermissionsDataTable.vue';
import { ButtonApp } from '@/components/app/button';
import { Plus, Shield } from 'lucide-vue-next';
import PermissionsDialog from './PermissionsDialog.vue';
import { ref } from 'vue';
import PermissionsForm from './PermissionsForm.vue';
import { storeToRefs } from 'pinia';
import type { Permission, PermissionPayload } from '@/types/auth';
import { toast } from 'vue-sonner';
import { EmptyResource } from '@/components/app/empty-resource';
import PermissionsDataTableDropdown from './PermissionsDataTableDropdown.vue';

const authStore = useAuthStore()
const { loading: permissionLoading, errors: authErrors } = storeToRefs(authStore)
const permissions = ref<Permission[]>()


const { handleShowPermissionDialog,
    showPermissionDialog,
    handlePermissionCreateSubmit,
    handleShowPermissionEditDialog,
    showPermissionEditDialog,
    selectedPermission,
    fetchPermissions,
    handlePermissionUpdateSubmit,
    handlePermissionDeleteSubmit } = usePermission()


function usePermission() {
    const showPermissionDialog = ref(false)
    const showPermissionEditDialog = ref(false)
    const selectedPermission = ref<Permission>()

    async function fetchPermissions() {
        permissions.value = await authStore.getPermissions()
    }
    function handleShowPermissionDialog() {
        showPermissionDialog.value = true
    }

    function handleShowPermissionEditDialog(permission: Permission) {
        showPermissionEditDialog.value = true
        selectedPermission.value = permission
    }

    async function handlePermissionCreateSubmit(payload: PermissionPayload) {
        await authStore.addPermission(payload);

        if (!authErrors.value) {
            await fetchPermissions()
            toast.info('Permission info', {
                description: 'Permission successfully added.'
            })
        } else {
            toast.error('Permission error', {
                description: 'Something went wrong while creating the permission.'
            })
        }
    }

    async function handlePermissionUpdateSubmit(payload: PermissionPayload) {

        if (!selectedPermission.value) {
            console.warn('no permission selected')
            return;
        }

        await authStore.updatePermission(selectedPermission.value.id, payload);

        if (!authErrors.value) {
            await fetchPermissions()
            toast.info('Permission info', {
                description: 'Permission successfully updated.'
            })
        } else {
            toast.error('Permission error', {
                description: 'Something went wrong while updating the permission.'
            })
        }
    }

    async function handlePermissionDeleteSubmit(permission: Permission) {
        await authStore.deletePermission(permission.id)

        if (!authErrors.value) {
            await fetchPermissions()
            toast.info('Permission info', {
                description: 'Permission successfully deleted.'
            })
        } else {
            toast.error('Permission error', {
                description: 'Something went wrong while deleting the permission.'
            })
        }
    }

    return {
        fetchPermissions,
        showPermissionDialog,
        showPermissionEditDialog,
        handleShowPermissionDialog,
        handleShowPermissionEditDialog,
        handlePermissionCreateSubmit,
        handlePermissionUpdateSubmit,
        handlePermissionDeleteSubmit,
        selectedPermission
    }
}


/* INIT */
await fetchPermissions()
</script>
<template>
    <Card class="p-4 space-y-4">
        <ButtonApp :prepend-icon="Plus" @click="handleShowPermissionDialog">Create permission</ButtonApp>
        <PermissionsDataTable v-if="permissions && permissions.length" :permissions="permissions">
            <template #actions="{ item }">
                <PermissionsDataTableDropdown @edit="handleShowPermissionEditDialog(item)"
                    @delete="handlePermissionDeleteSubmit(item)" />
            </template>
        </PermissionsDataTable>

        <EmptyResource v-else :icon="Shield" title="No permission found"
            description="You start viewing permissions as soon as you add one.">
            <ButtonApp class="w-fit mx-auto mt-4" :prepend-icon="Plus" @click="handleShowPermissionDialog">Create
                permission</ButtonApp>
        </EmptyResource>


        <!-- Creating permission -->
        <PermissionsDialog v-model="showPermissionDialog">
            <PermissionsForm :loading="permissionLoading" @submit="handlePermissionCreateSubmit">
            </PermissionsForm>
        </PermissionsDialog>

        <!-- Editing permission -->
        <PermissionsDialog v-model="showPermissionEditDialog" title="Edit permission">
            <PermissionsForm v-if="selectedPermission" :loading="permissionLoading"
                @submit="handlePermissionUpdateSubmit" mode="edit" :permission="selectedPermission">
            </PermissionsForm>
        </PermissionsDialog>
    </Card>
</template>



<style scoped></style>