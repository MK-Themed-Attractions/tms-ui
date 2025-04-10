<script setup lang="ts">
import { DataTable } from '@/components/app/data-table';
import { SectionHeader } from '@/components/app/section-header';
import { usePlanStore } from '@/stores/planStore';
import type { OutputPosting, OutputPostingQueryParams } from '@/types/outputPosting';
import { ref } from 'vue';
import { outputPostingDataTableColumns } from './data';
import { TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useDataTableChecks } from '@/composables/useDataTableChecks';
import { ButtonApp } from '@/components/app/button';
import { PaginationApp, type PaginationQuery } from '@/components/app/pagination';
import { useRoute } from 'vue-router';
import { useSimplePaginate } from '@/composables/usePaginate';
import { Send } from 'lucide-vue-next';
import { ConfirmationDialog } from '@/components/app/confirmation-dialog';
import { storeToRefs } from 'pinia';
import { toast } from 'vue-sonner';


const planStore = usePlanStore()
const { loading: planLoading, errors: planErrors } = storeToRefs(planStore)

const { getOutputPostings, outputPostings, hasNextPage, hasPrevPage, handlePostToBc } = usePlan()
const { handleShowConfirmationDialog, showConfirmationDialog } = useConfirmationDialog()
const viewSelected = ref(false)

/* @ts-ignore */
const { checkedItems, handleCheckAll, indicator, isChecked, toggleCheck } = useDataTableChecks<OutputPosting>(outputPostings)

function usePlan() {
    const { hasNextPage, hasPrevPage, items: outputPostings, paginate } = useSimplePaginate<OutputPosting>()

    async function getOutputPostings(params?: Partial<OutputPostingQueryParams | PaginationQuery>) {
        const paginationQueryParams = params as PaginationQuery
        const outputPostingQueryParams = params as OutputPostingQueryParams
        const finalParams: Partial<OutputPostingQueryParams> = {
            page: params?.page ?? 1,
            pages: paginationQueryParams.perPage || outputPostingQueryParams.pages || 30
        }

        const data = await planStore.getOutputPosting(finalParams)


        if (data) {
            checkedItems.value = []
            paginate.value = data;
        }
    }

    async function handlePostToBc() {
        if (!checkedItems.value || !checkedItems.value.length) return;

        const checkedItemsIds = checkedItems.value.reduce<string[]>((acc, item) => {
            acc.push(item.id)
            return acc;
        }, [])

        await planStore.postOutputPosting({ posting_ids: checkedItemsIds })

        if (!planErrors.value) {
            await getOutputPostings({
                page: route.query.page?.toString() || 1,
                pages: route.query.pages?.toString() || 30
            })

            toast.info('Output Posting Info', {
                description: 'Output is successfully posted to Business Central'
            })
        } else {
            toast.error('Outpost Posting Error', {
                description: 'There\'s a problem while posting the data to Business Central'
            })
        }
    }
    return {
        getOutputPostings,
        outputPostings,
        hasNextPage,
        hasPrevPage,
        handlePostToBc
    }

}

function useConfirmationDialog() {
    const showConfirmationDialog = ref(false)

    function handleShowConfirmationDialog() {
        showConfirmationDialog.value = true
    }

    return {
        showConfirmationDialog,
        handleShowConfirmationDialog
    }
}

const route = useRoute()
await getOutputPostings({
    page: route.query.page?.toString() || 1,
    pages: route.query.pages?.toString() || 30
})
</script>

<template>

    <div class="container space-y-6">
        <SectionHeader title="Output posting"
            description="Carefully check the task UUIDS before posting to prevent incorrect data on Business Central. QC failed tasks wont be included" />

        <header class="position sticky -top-6 z-10 bg-muted p-4 rounded-md shadow-sm">
            <ButtonApp :prepend-icon="Send" :disabled="!checkedItems.length" @click="handleShowConfirmationDialog">Post
                to Business Central</ButtonApp>
        </header>

        <main class="border rounded-md shadow-sm">
            <DataTable v-if="outputPostings" :items="viewSelected ? checkedItems : outputPostings"
                :columns="outputPostingDataTableColumns" :loading="planLoading">
                <template #header.check="{ item }">
                    <TableCell>
                        <Checkbox @update:checked="handleCheckAll" :checked="indicator" />
                    </TableCell>
                </template>
                <template #item.check="{ item }">
                    <TableCell>
                        <Checkbox @click="toggleCheck(item)" :checked="isChecked(item)" />
                    </TableCell>
                </template>

                <template #item.plan_code="{ item }">
                    <TableCell>
                        <span class="font-medium"> {{ item.plan_code }}</span>
                    </TableCell>
                </template>
                <template #item.plan_task_id="{ item }">
                    <TableCell class="flex flex-wrap gap-2">
                        <span class="uppercase rounded-md border px-2 text-xs" v-for="task in item.plan_task_id"
                            :key="task"> {{
                                task }}</span>
                    </TableCell>
                </template>

                <template #footer>
                    <div class="flex justify-between">
                        <ButtonApp variant="secondary" size="sm" @click="viewSelected = !viewSelected">View selected
                        </ButtonApp>
                        <PaginationApp per-page-name="pages" @change:query="getOutputPostings"
                            :disable-prev="!hasPrevPage" :disable-next="!hasNextPage" />
                    </div>
                </template>
            </DataTable>
        </main>

        <ConfirmationDialog v-model="showConfirmationDialog" title="Read before proceeding" @yes="handlePostToBc"
            description="You are about to post data to Business Central">
            <div>Please double-check all selected output, as it will affect related data in Business Central. Are you
                sure you
                want to post this output data to Business Central?</div>
        </ConfirmationDialog>
    </div>
</template>


<style scoped></style>