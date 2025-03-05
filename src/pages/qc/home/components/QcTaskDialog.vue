<script setup lang="ts">
import { Dialog, DialogDescription, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatReadableDate } from '@/lib/utils';
import type { WipTask } from '@/types/wip';
import type { QCTaskVerdict } from '../data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonApp } from '@/components/app/button';
import { ThumbsUp } from 'lucide-vue-next';
import type { DepartmentKPI, DepartmentKPIForm, DepartmentKPIPayload } from '@/types/qc';
import { Separator } from '@/components/ui/separator';
import { ref, watchEffect } from 'vue';
import { Textarea } from '@/components/ui/textarea';
import Label from '@/components/ui/label/Label.vue';
import { ConfirmationDialog } from '@/components/app/confirmation-dialog';
import { useQcStore } from '@/stores/qcStore';
import { useWipStore } from '@/stores/wipStore';


const props = defineProps<{
    task: WipTask
    verdict: QCTaskVerdict //default verdict
    departmentKpis: DepartmentKPI[]
}>()

const dialog = defineModel({ default: false })
const showConfirmationDialog = ref(false)
const checkedKpis = ref<DepartmentKPIForm[]>()
const finalVerdict = ref<QCTaskVerdict>('pass')

const wipStore = useWipStore()

async function handleSubmit() {
    if (!checkedKpis.value) return;

    //loop through each work center
    checkedKpis.value.forEach(async (dept) => {

        //collect the KPI id in an array
        const kpiArray = dept.kpi.reduce<string[]>((acc, kpi) => {
            if (kpi.checked)
                acc.push(kpi.id)
            return acc;
        }, [])


        //contruct the payload
        const payload: DepartmentKPIPayload = {
            status: finalVerdict.value,
            department_kpi_id: dept.id,
            checked_kpi_id: kpiArray,
            comment: dept.comment
        }

        await wipStore.changeTaskQCStatus(props.task.id, payload)
    })

}

function handlePass() {
    finalVerdict.value = 'pass'
    showConfirmationDialog.value = true;
}
function handleFail() {
    finalVerdict.value = 'fail'
    showConfirmationDialog.value = true;
}

watchEffect(() => {
    checkedKpis.value = props.departmentKpis.map(dept => {
        return {
            ...dept,
            kpi: dept.kpi.map(k => {
                return {
                    ...k,
                    checked: true
                }
            })
        }
    })
})
</script>
<template>
    <Dialog v-model:open="dialog">
        <DialogScrollContent class="max-w-[40rem] text-sm" @interact-outside="e => e.preventDefault()">
            <DialogHeader>
                <DialogTitle>Task Inspection</DialogTitle>
                <DialogDescription>View task details and mark it as pass or fail.</DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
                <div v-if="task"
                    class=" shadow-sm flex flex-wrap flex-col md:max-h-[9rem] border rounded-md p-4 [&>*:nth-child(even)]:mb-2 [&>*:nth-child(even)]:font-medium [&>*:nth-child(odd)]:text-muted-foreground">
                    <span>UUID:</span> <span class="uppercase">{{ task.task_plan_id }}</span>

                    <span>Product SKU:</span> <span>{{ task.sku }}</span>

                    <span>Planned start date:</span> <span>{{ formatReadableDate(task.can_accessed_at) }}</span>

                    <span>Required manpower:</span> <span>{{ task.manpower }}</span>
                </div>

                <Tabs :default-value="verdict" class="">
                    <TabsList class="w-full">
                        <TabsTrigger value="pass" class="grow">
                            Pass
                        </TabsTrigger>
                        <TabsTrigger value="fail" class="grow">
                            Fail
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="pass">
                        <Card>
                            <CardHeader>
                                <CardTitle>KPI Checklist</CardTitle>
                                <CardDescription>Carefully check if the item meets all the criteria below.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div v-for="dept in checkedKpis" :key="dept.id" class="p-4 border rounded-md space-y-2">
                                    <h3>Work center code: <strong>{{ dept.department }}</strong></h3>
                                    <Separator orientation="horizontal" />
                                    <ul class="grid lg:grid-cols-2 gap-2">
                                        <li v-for="kpi in dept.kpi" class="flex gap-2">
                                            <Checkbox class="mt-1" :checked="kpi.checked"
                                                @update:checked="e => kpi.checked = e" />
                                            <div>
                                                <p class="font-medium">{{ kpi.title }}</p>
                                                <span class="text-muted-foreground">{{ kpi.description }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                    <Separator />

                                    <div class="space-y-2">
                                        <Label for="comment">Comment (optional):</Label>
                                        <Textarea v-model="dept.comment" id="comment"></Textarea>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <ButtonApp :prepend-icon="ThumbsUp" @click="handlePass">Smash</ButtonApp>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="fail">
                        Failses
                    </TabsContent>
                </Tabs>
            </div>
        </DialogScrollContent>

        <ConfirmationDialog v-model="showConfirmationDialog" @yes="handleSubmit"></ConfirmationDialog>
    </Dialog>
</template>



<style scoped></style>