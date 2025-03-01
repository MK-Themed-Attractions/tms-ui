<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatReadableDate, getIconByTaskStatus } from '@/lib/utils';
import type { WipTask } from '@/types/wip';
import { CheckCircle, CircleHelp, Ellipsis, XCircle } from 'lucide-vue-next';

const props = defineProps<{
    tasks: WipTask[]
}>()

</script>
<template>
    <Table>
        <TableHeader>
            <TableRow class="border-none">
                <TableHead class="h-8">Status</TableHead>
                <TableHead class="h-8">Access date</TableHead>
                <TableHead class="h-8">Availability</TableHead>
                <slot name="action.header">
                    <TableCell class="h-8">
                        <Ellipsis />
                    </TableCell>
                </slot>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="task in tasks" :key="task.id" class="border-none group">
                <TableCell>
                    <Badge variant="secondary" class="gap-2">
                        <component class="size-4" :is="getIconByTaskStatus(task.status)" /> <span class="capitalize">{{
                            task.status }}</span>
                    </Badge>
                </TableCell>
                <TableCell class="text-muted-foreground">{{ formatReadableDate(task.can_accessed_at) }}
                </TableCell>
                <TableCell>
                    <CheckCircle v-if="task.is_startable" class="size-4 " />
                    <XCircle v-else class="size-4" />
                </TableCell>
                <TableCell>
                    <slot name="action" :task="task" />
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>



<style scoped></style>