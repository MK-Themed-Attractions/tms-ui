<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const props = withDefaults(defineProps<{
    rowCount?: number,
    colCount?: number
}>(), {
    colCount: 3,
    rowCount: 3
})
</script>
<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableCell :colspan="colCount">
                    <Skeleton class="h-10" />
                </TableCell>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="(_, index) in rowCount" :key="index">
                <TableCell v-for="(_, colIndex) in colCount" :key="colIndex">
                    <Skeleton class="h-2 my-1" />
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>


<style scoped></style>