<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import PermissionsDataTable from './PermissionsDataTable.vue';

const authStore = useAuthStore()
const permissions = await authStore.getPermissions()
</script>
<template>
    <Card class="p-4">
        <PermissionsDataTable v-if="permissions" :permissions="permissions" />
    </Card>
</template>



<style scoped></style>