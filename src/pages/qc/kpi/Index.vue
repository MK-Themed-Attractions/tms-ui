<script setup lang="ts">
import { TableCell } from '@/components/ui/table';
import KPIDataTable from './components/KPIDataTable.vue';
import { Ellipsis, Plus } from 'lucide-vue-next';
import { ButtonApp } from '@/components/app/button';
import KPIFormDialog from './components/KPIFormDialog.vue';

</script>
<template>
    <div class="space-y-6 container">
        <div>
            <h1 class="text-lg font-semibold md:text-2xl">Key performance indicator</h1>
            <p class="text-muted-foreground">
                Define and manage Key Performance Indicators (KPIs) by adding, editing, deleting, and assigning them to
                specific departments. This helps ensure clear performance tracking and quality standards across
                different areas.
            </p>
        </div>

        <div class="space-y-4">
            <KPIFormDialog>
                <ButtonApp :prepend-icon="Plus">Add KPI</ButtonApp>
            </KPIFormDialog>
            <div class="border rounded-md shadow-sm">
                <KPIDataTable>
                    <template #actions="{ item }">
                        <TableCell>
                            <ButtonApp class="size-6 group-hover:visible invisible" size="icon" variant="non">
                                <Ellipsis class="size-4" />
                            </ButtonApp>
                        </TableCell>
                    </template>
                </KPIDataTable>
            </div>
        </div>


    </div>
</template>



<style scoped></style>