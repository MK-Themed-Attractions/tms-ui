<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { SectionHeader } from '@/components/app/section-header';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/authStore';
import type { UserChangePassPayload } from '@/types/auth';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import ChangePasswordDialog from './ChangePasswordDialog.vue';
import { Lock } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const authStore = useAuthStore()

const { initialName, user, roles, authLoading, authErrors, handleChangePassword, userPermissionSet } = useUser()


function useUser() {
    const { user, loading: authLoading, errors: authErrors, userPermissionSet, roles } = storeToRefs(authStore)

    const initialName = computed(() => `${user.value.given_name[0]} ${user.value.last_name[0]}`)

    async function handleChangePassword(payload: UserChangePassPayload) {
        await authStore.changePassword(user.value.id, payload)

        if (!authErrors.value) {
            toast.info('Password Reset', {
                description: 'Your password has been successfully reset, please login to continue.',
                duration: 7000
            },)
            await authStore.logout()
        }
    }
    return {
        user,
        initialName,
        authLoading,
        authErrors,
        handleChangePassword,
        userPermissionSet,
        roles
    }
}
</script>
<template>
    <div class="container space-y-6">
        <SectionHeader title="Profile"
            description="This section displays your profile, including roles and permissions. You can also change your password." />


        <div class="space-y-4">
            <p class="text-sm font-medium text-muted-foreground">Account</p>
            <Separator class="!mt-2" />

            <div class="flex gap-4 items-center">
                <div class="rounded-full bg-muted size-[5rem] relative isolate">
                    <span
                        class="absolute text-[2em] text-muted-foreground font-bold inset-0 place-content-center grid pb-2">{{
                            initialName }}</span>
                </div>
                <div>
                    <p class="font-medium">{{ user.given_name }} {{ user.last_name }}</p>
                    <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <p class="text-sm font-medium text-muted-foreground">Roles</p>
            <Separator class="!mt-2" />

            <ul class="flex flex-wrap gap-4">
                <li v-for="userRole in roles" :key="userRole.id" class="pl-2 border-l-2">
                    <p class="font-medium">{{ userRole?.name }}</p>
                    <em class="text-sm">{{ userRole?.description }}</em>
                </li>
            </ul>
            <ul class="rounded-md bg-muted/50 text-xs flex flex-wrap gap-2 shadow-sm p-2">
                <li v-for="permission in userPermissionSet" :key=permission class="font-medium bg-white p-2 rounded-md">
                    {{
                        permission }}</li>
            </ul>
        </div>

        <div class="space-y-4">
            <p class="text-sm font-medium text-muted-foreground">Security</p>
            <Separator class="!mt-2" />
            <ChangePasswordDialog :loading="authLoading" @submit="handleChangePassword" :errors="authErrors">
                <ButtonApp :prepend-icon="Lock">Change password</ButtonApp>
            </ChangePasswordDialog>
        </div>
    </div>


</template>



<style lang="scss" scoped></style>