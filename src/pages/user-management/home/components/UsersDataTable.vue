<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import type { User } from '@/types/auth';
import { userDataTableColumns } from '..';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { ButtonApp } from '@/components/app/button';

const props = defineProps<{
    users: User[]
}>()
const { search, filteredUsers } = useFilter()

function useFilter() {
    const search = ref('')

    const filteredUsers = computed(() => {
        return props.users.filter((user) => {
            return user.given_name.includes(search.value) ||
                user.last_name.includes(search.value) ||
                user.email.includes(search.value)
        })
    })
    return {
        search,
        filteredUsers
    }
}
</script>
<template>
    <div class="rounded border shadow-sm">
        <div class="p-4  flex items-center justify-between">
            <div class="relative w-1/3">
                <Search class="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input class="pl-8" placeholder="Search users..." v-model="search" />
            </div>
            <div>
                <ButtonApp>Add user</ButtonApp>
            </div>
        </div>
        <DataTable :items="filteredUsers" :columns="userDataTableColumns">
            <template #item.email="{ item }">
                <TableCell>
                    <span class="font-medium">
                        {{ item.email }}
                    </span>
                </TableCell>
            </template>
            <template #item.full_name="{ item }">
                <TableCell>
                    {{ item.given_name }} {{ item.last_name }}
                </TableCell>
            </template>
            <template #item.id="{ item }">
                <TableCell class="uppercase">
                    {{ item.id }}
                </TableCell>
            </template>
        </DataTable>
    </div>

</template>



<style scoped></style>