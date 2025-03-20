<script setup lang="ts">
import { HardHat } from 'lucide-vue-next';
import IconContainer from '../../components/IconContainer.vue';


</script>
<template>
    <div class="border rounded-md p-4 shadow-sm flex gap-4 items-center">
        <IconContainer>
            <HardHat />
        </IconContainer>
        <div class="flex flex-wrap gap-6 grow">
            <div>
                <span class="text-xs text-muted-foreground">ID</span>
                <p class="font-medium">1572</p>
            </div>
            <div>
                <span class="text-xs text-muted-foreground">Employee</span>
                <p class="font-medium">Roy Victor Gagarin</p>
            </div>
            <div>
                <span class="text-xs text-muted-foreground">Department</span>
                <p class="font-medium">Assembly</p>
            </div>
            <div>
                <span class="text-xs text-muted-foreground">Tasks</span>
                <p class="font-medium">10</p>
            </div>
            <div>
                <span class="text-xs text-muted-foreground">Points</span>
                <p class="font-medium">1,598</p>
            </div>
        </div>
    </div>
</template>



<style scoped></style>