<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { useAuthStore } from '@/stores/authStore';
import { userDataTableColumns } from '.';
import UsersData from './components/UsersDataTable.vue';

const authStore = useAuthStore()

const users = await authStore.getUsers()
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

        <UsersData v-if="users" :users="users" />
    </div>
</template>



<style scoped></style>