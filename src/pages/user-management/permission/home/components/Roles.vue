<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import RolesDataTable from './RolesDataTable.vue';

const authStore = useAuthStore()

const roles = await authStore.getRoles()
</script>
<template>
    <Card class="p-4">
        <RolesDataTable v-if="roles" :roles="roles" />
    </Card>
</template>



<style scoped></style>