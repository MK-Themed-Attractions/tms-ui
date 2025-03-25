<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import RolesDataTable from './RolesDataTable.vue';
import { computed, ref } from 'vue';
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
import { Loader } from '@/components/app/loader';
import { PaginationApp, type PaginationQuery } from '@/components/app/pagination';
import { useSimplePaginate } from '@/composables/usePaginate';
import { useRoute } from 'vue-router';


const route = useRoute()
const authStore = useAuthStore()
const { errors: authErrors, loading: authLoading } = storeToRefs(authStore)
const { fetchRoles,
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

const { hasNextPage, hasPrevPage, roles, rolesPaginate, page, perPage } = usePaginate()

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

    async function fetchRoles(query?: Partial<PaginationQuery>) {
        rolesPaginate.value = await authStore.getRoles({
            page: <string>query?.page || page.value,
            pages: <string>query?.perPage || perPage.value
        })
    }

    async function handleRoleCreateSubmit(payload: RolePayload) {
        await authStore.addRole(payload);

        if (!authErrors.value) {
            await fetchRoles()
            toast.info('Role info', {
                description: 'Role successfully added.'
            })
        }
        else {
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

        if (!authErrors.value) {
            await fetchRoles()
            toast.info('Role info', {
                description: 'Permissions successfully attached.'
            })
        }
        else {
            toast.error('Role error', {
                description: 'Something went wrong while attaching permissions.'
            })
        }

    }

    return {
        showRolesPermissionAttachDialog,
        handleShowRolePermissionAttachDialog,
        handlePermissionAttachSubmit
    }

}

function usePaginate() {
    const { hasNextPage, hasPrevPage, items: roles, paginate: rolesPaginate } = useSimplePaginate<Role>()
    const page = computed(() => <string>route.query.page || '1')
    const perPage = computed(() => <string>route.query.pages || '30')

    return {
        hasNextPage,
        hasPrevPage,
        roles,
        rolesPaginate,
        page,
        perPage
    }
}

await fetchRoles({
    page: '1',
    perPage: '30'
})
</script>
<template>
    <Card class="p-4 space-y-4">
        <ButtonApp :prepend-icon="Plus" @click="handleShowRoleDialog">Create Role</ButtonApp>
        <RolesDataTable v-if="roles && roles.length" :roles="roles">
            <template #actions="{ item }">
                <RolesDataTableDropdown @edit="handleShowRoleEditDialog(item)" @delete="handleRoleDeleteSubmit(item)"
                    @attach="handleShowRolePermissionAttachDialog(item)" />
            </template>
            <template #footer>
                <PaginationApp per-page-name="pages" @change:query="fetchRoles" :disable-prev="!hasPrevPage"
                    :disable-next="!hasNextPage" />
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
            <Suspense>
                <RolePermissionAttachForm :role="selectedRole" @submit="handlePermissionAttachSubmit"
                    :loading="authLoading" />
                <template #fallback>
                    <Loader class="min-h-10 p-4" description="Loading permissions..." />
                </template>
            </Suspense>
        </RolesPermissionAttachDialog>
    </Card>
</template>



<style scoped></style>