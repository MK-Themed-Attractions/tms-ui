<script setup lang="ts">
import { PaginationButtonsApp, PaginationPerPageApp, type PaginationAppProps, type PaginationButtonsAppProps } from '.';

const props = defineProps<PaginationAppProps & PaginationButtonsAppProps>()

const perPage = defineModel('pages', { default: '30' })
const page = defineModel('page', { default: '1' })

if (props.defaultPerPage)
    perPage.value = props.defaultPerPage.toString()


</script>
<template>
    <div class="flex justify-end gap-6">
        <PaginationPerPageApp v-model:pages="perPage" class="flex items-center gap-2"></PaginationPerPageApp>
        <PaginationButtonsApp v-model:page="page" class="flex items-center gap-2" :loading="loading"
            :disable-prev="disablePrev" :disable-next="disableNext">
        </PaginationButtonsApp>
    </div>
</template>



<style scoped></style>