<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { kpiDataTableColumns } from '../data';
import { PaginationApp2 } from '@/components/app/pagination';
import { useQcStore } from '@/stores/qcStore';
import { storeToRefs } from 'pinia';
import { useRouteQuery } from '@vueuse/router';
import { ref, watch } from 'vue';
import { TableCell } from '@/components/ui/table';
import { CheckCircle, XCircle } from 'lucide-vue-next';



const { hasNextPage, hasPrevPage, kpis, fetchKPIs, page, perPage, loading } = usePaginate()

function usePaginate() {
    const qcStore = useQcStore()
    const { hasPrevPage, hasNextPage, kpis, loading } = storeToRefs(qcStore)
    const page = useRouteQuery('page', '1')
    const perPage = useRouteQuery('pages', '30')
    const isPerPageChanges = ref(false)



    watch(perPage, async () => {
        /* changing page.value here will trigger another fetch 
        because of page being watch. To prevent this,
        a flag is required */
        isPerPageChanges.value = true;
        page.value = '1'

        await fetchKPIs()
        isPerPageChanges.value = false;

    })
    watch(page, async () => {
        /* prevent fetching when flag is true */
        if (isPerPageChanges.value) return

        await fetchKPIs()
    })


    async function fetchKPIs() {
        await qcStore.getKPIs({
            page: +page.value,
            pages: +perPage.value,
        })
    }

    return {
        hasNextPage,
        hasPrevPage,
        fetchKPIs,
        kpis,
        page,
        perPage,
        loading
    }
}


await fetchKPIs()

</script>

<template>
    <DataTable v-if="kpis" :items="kpis" :columns="kpiDataTableColumns">
        <template #item.description="{ item }">
            <TableCell>
                <em>{{ item.description }}</em>
            </TableCell>
        </template>
        <template #item.is_default="{ item }">
            <TableCell>
                <component :is="item.is_default ? CheckCircle : XCircle" class="size-4" />
            </TableCell>
        </template>
        <template #item.departments="{ item }">
            <TableCell>
                <ul v-if="item.departments && item.departments.length" class="flex items-center flex-wrap gap-2">
                    <li v-for="dept in item.departments" :key="dept.id" class="text-xs border rounded-md px-1">
                        {{ dept.department }}
                    </li>
                </ul>
                <div v-else class="text-xs border rounded-md px-1 w-fit">
                    All
                </div>
            </TableCell>
        </template>
        <template #item.actions="{ item }">
            <slot name="actions" :item="item" />
        </template>

        <template #footer>
            <PaginationApp2 v-model:page="page" v-model:pages="perPage" class="col-span-full"
                :disable-prev="!hasPrevPage" :disable-next="!hasNextPage" :loading="loading">
            </PaginationApp2>
        </template>
    </DataTable>

</template>


<style scoped></style>