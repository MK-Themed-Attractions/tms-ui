<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import PermissionsDataTable from './PermissionsDataTable.vue';
import { ButtonApp } from '@/components/app/button';
import { Plus } from 'lucide-vue-next';
import PermissionsDialog from './PermissionsDialog.vue';
import { ref } from 'vue';

const authStore = useAuthStore()
const permissions = await authStore.getPermissions()
const { handleShowPermissionDialog, showPermissionDialog } = usePermission()

function usePermission() {
    const showPermissionDialog = ref(false)

    function handleShowPermissionDialog() {
        showPermissionDialog.value = true
    }

    return {
        showPermissionDialog,
        handleShowPermissionDialog
    }
}
</script>
<template>
    <Card class="p-4">
        <ButtonApp :prepend-icon="Plus" @click="handleShowPermissionDialog">Create permission</ButtonApp>
        <PermissionsDataTable v-if="permissions" :permissions="permissions" />

        <PermissionsDialog v-model="showPermissionDialog">
            <PermissionForm></PermissionForm>
        </PermissionsDialog>
    </Card>
</template>



<style scoped></style>