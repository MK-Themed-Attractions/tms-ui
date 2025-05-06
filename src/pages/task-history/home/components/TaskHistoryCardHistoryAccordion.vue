<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatReadableDate } from '@/lib/utils';
import type { ProductRoutingWorkCenterType } from '@/types/products';
import type { HistoryContent, HistoryContentType } from '@/types/taskHistory';
import { CheckCircle, Dot, Pause, Play, PlusCircle, RefreshCw, ShieldCheck, ShieldX, UserCheck, UserX, XCircle } from 'lucide-vue-next';
import { useRoute } from 'vue-router';


const route = useRoute()
const props = defineProps<{
    workCenter: ProductRoutingWorkCenterType
    contents: HistoryContent[]
}>()
const getIconByContentType = (type: HistoryContentType) => {
    switch (type) {
        case "created":
            return PlusCircle;

        case "assigned":
            return UserCheck;

        case "unassigned":
            return UserX;

        case "started":
            return Play;

        case "paused":
            return Pause;

        case "finished":
            return CheckCircle;

        case "cancelled":
            return XCircle;

        case "override":
            return RefreshCw;

        case "qc-passed":
            return ShieldCheck;

        case "qc-failed":
            return ShieldX;

        default:
            return XCircle;  // Fallback icon for unknown types
    }
};
</script>

<template>
    <Accordion type="single" collapsible :default-value="<string>route.query.workCenter">
        <AccordionItem :value="workCenter">
            <AccordionTrigger class="py-1 gap-2 justify-start !pointer-events-auto">Open history</AccordionTrigger>
            <AccordionContent class="space-y-4 mt-2">
                <div v-for="(content, index) in contents" :key="content.created_at" class="flex relative gap-4">
                    <Dot :stroke-width="5" :class="{ 'text-primary': index === 0 }" class="z-20" v-if="index !== 0" />
                    <div v-else
                        class="border border-muted-foreground bg-white rounded-full size-6 grid place-content-center z-20 [data-index]">
                        <component :is="getIconByContentType(content.type)" class=" size-4" />
                    </div>

                    <div :data-index="index"
                        class="w-px  border-muted-foreground absolute top-2.5 h-[3.2rem] left-[11.3px] z-10"
                        :class="{ 'border-l border-dashed': index < contents.length - 1 }">
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="font-medium" :class="{ 'text-primary': index === 0 }"> {{ content.message }}</span>
                        <span class="text-xs">{{ formatReadableDate(content.created_at) }}</span>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
</template>


<style scoped></style>