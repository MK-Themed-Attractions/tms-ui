<script setup lang="ts">
import { ImageApp } from '@/components/app/image';
import { SectionHeader } from '@/components/app/section-header';
import { TaskGroupLabel } from '@/components/app/task-group';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatReadableDate, getS3Link } from '@/lib/utils';
import type { PlanCalendar } from '@/types/planning';

const dialog = defineModel({ default: false })
const props = defineProps<{
    planCalendar: PlanCalendar
}>()
</script>

<template>
    <Dialog v-model:open="dialog">
        <DialogContent @interact-outside="e => e.preventDefault()">
            <DialogHeader>
                <DialogTitle>Plan {{ planCalendar.plan_data.code }}</DialogTitle>
                <DialogDescription>Show plan information including plan data, runtime data, and product data
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
                <div class="flex gap-4 ">
                    <div class="rounded-md border overflow-hidden">
                        <ImageApp :image="getS3Link(planCalendar.product_data.image?.filename || '', 'small')" />
                    </div>
                    <div class="flex gap-4 flex-wrap place-content-start bg-muted/50 p-2 rounded-md shadow">
                        <TaskGroupLabel label="Plan code">
                            <RouterLink
                                :to="{ name: 'taskHistoryIndex', query: { filter: 'plan_code', q: planCalendar.plan_data.code } }"
                                target="_blank">
                                {{ planCalendar.plan_data.code }}
                            </RouterLink>
                        </TaskGroupLabel>
                        <TaskGroupLabel label="Plan type">
                            {{ planCalendar.plan_data.is_prototype ? 'Prototype' : 'Regular' }}
                        </TaskGroupLabel>
                        <TaskGroupLabel label="Product SKU">
                            <RouterLink
                                :to="{ name: 'productShow', params: { productId: planCalendar.product_data.sku } }"
                                target="_blank">
                                {{ planCalendar.product_data.sku }}

                            </RouterLink>
                        </TaskGroupLabel>
                        <TaskGroupLabel label="Product title">
                            {{ planCalendar.product_data.title }}
                        </TaskGroupLabel>
                    </div>

                </div>

                <Card class="p-4 flex flex-wrap gap-4 *:grow">
                    <TaskGroupLabel label="Start date">{{ formatReadableDate(planCalendar.start_date) }}
                    </TaskGroupLabel>
                    <TaskGroupLabel label="End date">{{ formatReadableDate(planCalendar.end_date) }}
                    </TaskGroupLabel>
                    <TaskGroupLabel label="Total runtime">{{ planCalendar.total_runtime }} <span
                            class="text-sm font-normal">mins</span>
                    </TaskGroupLabel>
                    <TaskGroupLabel label="Total Tasks">{{ planCalendar.total_tasks }} <span
                            class="text-sm font-normal">tasks</span>
                    </TaskGroupLabel>
                </Card>
            </div>
        </DialogContent>
    </Dialog>
</template>


<style scoped></style>