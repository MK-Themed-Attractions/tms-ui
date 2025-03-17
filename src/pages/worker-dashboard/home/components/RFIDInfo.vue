<script setup lang="ts">
import { CheckCircle, Nfc, XCircle } from 'lucide-vue-next';
import IconContainer from '../../components/IconContainer.vue';

const props = defineProps<{
    rfid: string
}>()
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
            <CheckCircle class="mx-auto" v-if="rfid" />
            <XCircle class="mx-auto" v-else />
            <span class="text-xs font-medium ">
                {{ rfid ? 'Detected' : 'Not detected' }}
            </span>
        </div>
    </div>
</template>



<style scoped></style>