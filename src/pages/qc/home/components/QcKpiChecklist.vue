<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type { DepartmentKPIForm } from '@/types/qc';
import { ThumbsDown, ThumbsUp } from 'lucide-vue-next';
import type { QCTaskVerdict } from '../data';
import { ButtonApp } from '@/components/app/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { computed } from 'vue';


const checkedKpis = defineModel<DepartmentKPIForm[]>('checked');

const props = defineProps<{
    description?: string;
    verdict: QCTaskVerdict;
    loading?: boolean
}>()

const emits = defineEmits<{
    (e: 'submit', verdict: QCTaskVerdict): void
}>()

const kpiPerWorkCenterCount = computed(() => {
    if (!checkedKpis.value) return;
    const arr: number[] = []

    checkedKpis.value.forEach(dept => {
        const checkedCount = dept.kpi.reduce<number>((acc, kpi) => {
            if (!kpi.checked) {
                acc++;
            }
            return acc;
        }, 0)

        arr.push(checkedCount)
    })

    return arr;
})

const canFail = computed(() => {
    return kpiPerWorkCenterCount.value?.every(c => c)
})

</script>
<template>
    <Card>
        <CardHeader>
            <CardTitle>KPI Checklist</CardTitle>
            <CardDescription>{{ description ? description : 'Carefully check if the item meets all the criteria below.'
            }}
            </CardDescription>
        </CardHeader>

        <CardContent>
            <div v-for="dept in checkedKpis" :key="dept.id" class="p-4 border rounded-md space-y-2">
                <h3>Work center code: <strong>{{ dept.department }}</strong></h3>
                <Separator orientation="horizontal" />
                <ul class="grid lg:grid-cols-2 gap-2">
                    <li v-for="kpi in dept.kpi" class="flex gap-2">
                        <Checkbox class="mt-1" :checked="kpi.checked" @update:checked="e => kpi.checked = e"
                            :id="`cb-${kpi.id}`" />
                        <div>
                            <Label class="font-medium" :for="`cb-${kpi.id}`">{{ kpi.title }}</Label>
                            <p class="text-muted-foreground">{{ kpi.description }}</p>
                        </div>
                    </li>
                </ul>
                <Separator />

                <div class="space-y-2">
                    <Label for="comment">Comment {{ verdict === 'pass' ? '(optional)' : '(required)' }}:</Label>
                    <Textarea v-model="dept.comment" id="comment"></Textarea>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <ButtonApp :prepend-icon="verdict === 'pass' ? ThumbsUp : ThumbsDown" @click="$emit('submit', verdict)"
                :disabled="!canFail && verdict === 'fail' || loading" :loading="loading">
                {{ verdict === 'pass' ? 'QC Pass' : 'QC Fail' }}</ButtonApp>
        </CardFooter>
    </Card>
</template>



<style scoped></style>