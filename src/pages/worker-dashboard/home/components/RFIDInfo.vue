<script setup lang="ts">
import { CheckCircle, Nfc, Search, XCircle } from 'lucide-vue-next';
import IconContainer from '../../components/IconContainer.vue';
import type { RFIDState } from '../..';
import { computed } from 'vue';

const props = defineProps<{
    state: RFIDState
}>()

const rfidStateData = computed(() => {
    switch (props.state) {
        case 'detected':
            return {
                icon: CheckCircle,
                text: 'Detected'
            }
        case 'scanning':
            return { icon: Search, text: 'Scanning' }
        case 'not-detected':
            return { icon: XCircle, text: 'Not Detected' }
    }
})

</script>
<template>
    <div class="border shadow-sm rounded-md p-4 min-h-[5rem] flex items-center gap-4 w-fit">
        <IconContainer>
            <Nfc />
        </IconContainer>
        <div>
            <h3 class="font-medium">Scan your RFID</h3>
            <p class="text-sm text-muted-foreground max-w-[30ch]">Place your RFID on the scanner
                to get your assigned tasks.</p>
        </div>

        <div class="text-center text-muted-foreground">
            <component :is="rfidStateData.icon" class="mx-auto"/>
            <span class="text-xs font-medium ">
                {{ rfidStateData.text }}
            </span>
        </div>
    </div>
</template>



<style scoped></style>