<script setup lang="ts">
import { ImageApp } from '@/components/app/image';
import { Loader } from '@/components/app/loader';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getIconByTaskStatus, getS3Link } from '@/lib/utils';
import type { WipTask } from '@/types/wip';
import { CheckCircle, XCircle } from 'lucide-vue-next';


const props = defineProps<{
    batch: WipTask[],
    loading?: boolean
}>()

</script>
<template>
    <Card class="p-2">
        <slot />
        <Table v-if="!loading">
            <TableHeader>
                <TableRow>
                    <TableHead>Product SKU</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="task in batch">
                    <TableCell class="py-0">{{ task.sku }}</TableCell>
                    <TableCell class="py-0">
                        <Badge variant="secondary" class="flex gap-1 w-fit">
                            <component :is="getIconByTaskStatus(task.status)" class="size-4" /> {{ task.status }}
                        </Badge>
                    </TableCell>
                    <TableCell class="py-0">
                        <component :is="task.is_startable ? CheckCircle : XCircle" class="size-4" />
                    </TableCell>
                    <TableCell class="py-0">
                        <slot name="actions" :item="task">
                        </slot>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <div v-else class="min-w-[30rem] min-h-[10rem] grid mt-2">
            <Loader description="Refreshing list..." />
        </div>
    </Card>
</template>



<style scoped></style>