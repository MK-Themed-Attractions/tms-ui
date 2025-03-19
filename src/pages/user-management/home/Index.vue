<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import UsersDataTable from './components/UsersDataTable.vue';
import UserDataTableDropdown from './components/UserDataTableDropdown.vue';
import { Ellipsis, Plus, Search, X } from 'lucide-vue-next';
import type { UserDataTableDropdownEvent, UserDialogFormSubmitCallback } from '.';
import UserDialog from './components/UserDialog.vue';
import { Input } from '@/components/ui/input';
import { ButtonApp } from '@/components/app/button';
import { h, ref, toDisplayString, type Component } from 'vue';
import type { User, UserPayload, UserPermissionAttachPayload, UserRoleAttachPayload } from '@/types/auth';
import { computed, shallowRef } from '@vue/reactivity';
import UserDialogForm from './components/UserDialogForm.vue';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';
import UserDialogEditForm from './components/UserDialogEditForm.vue';
import UserDialogAttachRoleForm from './components/UserDialogAttachRoleForm.vue';
import { Loader } from '@/components/app/loader';
import UserDialogResetPassword from './components/UserDialogResetPassword.vue';
import UserDialogAttachPermissionsForm from './components/UserDialogAttachPermissionsForm.vue';

const authStore = useAuthStore()
const { loading: authLoading, errors: authErrors } = storeToRefs(authStore)
const { search, searchedUsers } = useFilter()
const { fetchUsers, users, } = useUser()
const { handleShowCreateUserDialog,
    selectedComponent,
    showUserDialog,
    userDialogProps,
    selectedComponentProps,
    handleShowEditUserDialog,
    handleShowAttachRoleDialog,
    handleShowResetPassword,
    handleShowAttachPermissionDialog } = useDialog()

function useUser() {
    const users = ref<User[]>()
    async function fetchUsers() {
        users.value = await authStore.getUsers()
    }
    return {
        users,
        fetchUsers
    }
}

function useFilter() {

    const search = ref('')

    const searchedUsers = computed(() => {
        if (!users.value) return;

        return users.value.filter((user) => {
            return user.given_name.toLowerCase().includes(search.value.toLowerCase()) ||
                user.last_name.toLowerCase().includes(search.value.toLowerCase()) ||
                user.email.toLowerCase().includes(search.value.toLowerCase())
        })
    })
    return {
        search,
        searchedUsers
    }
}

function useDialog() {
    const showUserDialog = ref(false)
    const userDialogProps = ref<{ title?: string; description?: string }>()
    const selectedComponent = shallowRef<Component>()
    const selectedComponentProps = ref()

    function handleShowCreateUserDialog() {
        userDialogProps.value = { title: 'Add User', description: 'Create a new user, you can add roles and permissions after the user has been created.' }
        showUserDialog.value = true;
        selectedComponentProps.value = { onSubmit: handleCreateUser, loading: authLoading }
        selectedComponent.value = UserDialogForm
    }

    function handleShowEditUserDialog(user: User) {
        userDialogProps.value = { title: 'Edit User', description: 'Edit new user. Note that only users can change their password.' }
        showUserDialog.value = true;
        selectedComponentProps.value = { onSubmit: handleUpdateUser, loading: authLoading, initialValues: user }
        selectedComponent.value = UserDialogEditForm
    }

    function handleShowAttachRoleDialog(user: User) {

        userDialogProps.value = { title: 'Attach role', description: 'You can choose to attach or detach a role.' };
        showUserDialog.value = true;
        selectedComponent.value = UserDialogAttachRoleForm
        selectedComponentProps.value = { loading: authLoading, onSubmit: handleAttachRole, user }
    }

    function handleShowResetPassword(user: User) {
        userDialogProps.value = { title: 'Reset Password', description: 'Please confirm before proceeding' }
        showUserDialog.value = true;
        selectedComponent.value = UserDialogResetPassword
        selectedComponentProps.value = { onSubmit: handleResetPassword, loading: authLoading, userId: user.id }

    }

    function handleShowAttachPermissionDialog(user: User) {
        userDialogProps.value = { title: 'Attach permissions', description: 'Attach direct permissions to the user' }
        showUserDialog.value = true;
        selectedComponent.value = UserDialogAttachPermissionsForm
        selectedComponentProps.value = { loading: authLoading, user, onSubmit: handleAttachPermissions }
    }

    async function handleCreateUser(data: UserPayload, callback: UserDialogFormSubmitCallback) {
        await authStore.addUser(data)

        if (!authErrors.value) {
            await fetchUsers()
            callback(true)
            toast.info('User info', {
                description: 'User successfully created.'
            })
        } else {
            toast.error('User error', {
                description: 'Something went wrong while creating the user.'
            })
        }
    }

    async function handleUpdateUser(userId: string, data: UserPayload, callback: UserDialogFormSubmitCallback) {
        await authStore.updateUser(userId, data)

        if (!authErrors.value) {
            await fetchUsers()
            callback(true)
            toast.info('User info', {
                description: 'User successfully updated.'
            })
        } else {
            toast.error('User error', {
                description: 'Something went wrong while updating the user.'
            })
        }
    }

    async function handleResetPassword(userId: string) {
        const newPassword = await authStore.resetPassword(userId)

        if (!authErrors.value) {
            const toastId = toast('Password has been successfully reset.', {
                description: `New password: ${newPassword}`,
                dismissible: false,
                duration: 1000000,
                action: {
                    label: 'Close',
                    onClick: () => toast.dismiss(toastId),
                }
            })
            showUserDialog.value = false
        }
        else toast.error('Reset password error', {
            description: 'Something went wrong while resetting the password'
        })
    }

    async function handleAttachRole(userId: string, payload: UserRoleAttachPayload, cb: UserDialogFormSubmitCallback) {
        await authStore.attachRoleToUser(userId, payload)

        if (!authErrors.value) {
            toast.info('User role info', {
                description: 'New role has been successfully attached to the user'
            })
            cb(true)
            showUserDialog.value = false
        } else {
            toast.error('User role error', {
                description: 'Something went wrong while attaching a role to the user'
            })
        }
    }

    async function handleAttachPermissions(userId: string, payload: UserPermissionAttachPayload) {
        await authStore.attachPermissionsToUser(userId, payload)

        if (!authErrors.value) {
            toast.info('User permission info', {
                description: 'Permissions have been successfully attached to the user'
            })
            showUserDialog.value = false
        } else {
            toast.error('User permission error', {
                description: 'Something went wrong while attaching permissions to the user'
            })
        }
    }

    return {
        showUserDialog,
        userDialogProps,
        selectedComponent,
        selectedComponentProps,
        handleShowCreateUserDialog,
        handleShowEditUserDialog,
        handleShowAttachRoleDialog,
        handleShowResetPassword,
        handleShowAttachPermissionDialog
    }
}

function handleDropdown(event: UserDataTableDropdownEvent, user: User) {
    switch (event) {
        case 'edit':
            handleShowEditUserDialog(user)
            break;
        case 'attach-permission':
            handleShowAttachPermissionDialog(user)
            break;
        case 'attach-role':
            handleShowAttachRoleDialog(user)
            break;
        case 'reset-password':
            handleShowResetPassword(user)
            break;
        default:
            break;
    }
}

/* INIT */
await fetchUsers()
</script>
<template>
    <div class="container space-y-6">
        <div>
            <h1 class="text-lg font-semibold md:text-2xl">User management</h1>
            <p class="text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis amet explicabo pariatur rerum
                recusandae veritatis, incidunt suscipit praesentium? Dicta omnis laboriosam quos ullam atque expedita
                consequatur sit, in amet eum!
            </p>
        </div>

        <div class="rounded-md border shadow-sm">
            <div class="p-4  flex items-center justify-between">
                <div class="relative w-1/3">
                    <Search class="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input class="pl-8" placeholder="Search users..." v-model="search" />
                </div>
                <div>
                    <ButtonApp :prepend-icon="Plus" @click="handleShowCreateUserDialog">Add user</ButtonApp>
                </div>
            </div>
            <UsersDataTable v-if="searchedUsers" :users="searchedUsers">
                <template #actions="{ item }">
                    <UserDataTableDropdown @select="(e) => handleDropdown(e, item)">
                        <Ellipsis class="size-4 text-muted-foreground" />
                    </UserDataTableDropdown>
                </template>
            </UsersDataTable>
        </div>
        <UserDialog v-model="showUserDialog" v-if="selectedComponent" v-bind="userDialogProps">
            <Suspense>
                <component :is="selectedComponent" v-bind="selectedComponentProps"></component>

                <template #fallback>
                    <Loader class="min-h-10 p-4" description="Loading, please wait..." />
                </template>
            </Suspense>
        </UserDialog>
    </div>
</template>



<style scoped></style>