<script setup lang="ts">

import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/stores/authStore';
import { LoaderCircle, } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import RFIDInfo from './components/RFIDInfo.vue';
import NoTaskFound from './components/NoTaskFound.vue';
import WorkerInfo from './components/WorkerInfo.vue';
import WorkerToolbar from './components/WorkerToolbar.vue';


const authStore = useAuthStore()
const { } = useWorker()
const { rfid, handleKeydown } = useScanner()

function useScanner() {
    const rfid = ref('')
    const scanBuffer = ref(""); // Stores temporary scanned RFID
    const scanStartTime = ref(0)

    const isValidRFID = (data: string) => {
        return /^\d+$/.test(data); // Only allow numbers (adjust if RFID has letters)
    };

    const handleKeydown = (event: KeyboardEvent) => {
        const currentTime = Date.now();

        // Reset buffer if first keypress or if delay is more than 500ms
        if (!scanStartTime.value || currentTime - scanStartTime.value > 50) {
            scanBuffer.value = "";
        }

        scanStartTime.value = currentTime;

        // Process scan when "Enter" key is pressed
        if (event.key === "Enter") {
            if (isValidRFID(scanBuffer.value)) {
                rfid.value = scanBuffer.value;
            }
            scanBuffer.value = ""; // Reset for the next scan
            return;
        }

        // Append only valid alphanumeric characters (ignore Enter, Escape, Spaces, etc.)
        if (/^[a-zA-Z0-9]$/.test(event.key)) {
            scanBuffer.value += event.key;
        }
    };

    return {
        rfid,
        handleKeydown
    }

}
function useWorker() {


    return {

    }
}

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
    <div class="container p-6 space-y-6 h-screen" v-if="true">
        <div>
            <h1 class="text-2xl font-medium">Worker Dashboard</h1>
            <p class="text-sm text-muted-foreground max-w-[78ch]"> Scan your RFID and select your assigned tasks. You
                can start tasks
                individually or in batches.
                You will be automatically logged out after each action or if you remain idle for too long. </p>
        </div>
        <div class="flex flex-wrap gap-4 flex-col lg:flex-row">
            <RFIDInfo :rfid="rfid" class="mx-auto lg:m-0" />
            <WorkerInfo class="flex-1" />
            <WorkerToolbar class="grow basis-full" />
        </div>
        <ScrollArea class="relative isolate h-[62%] overflow-y-auto border rounded-md border-dashed">
            <NoTaskFound />
        </ScrollArea>
    </div>
    <div v-else class="min-h-screen grid place-content-center">
        <LoaderCircle class="mx-auto animate-spin" />
        <p class="text-muted-foreground">Loading, please wait...</p>
    </div>
</template>


<style scoped></style>