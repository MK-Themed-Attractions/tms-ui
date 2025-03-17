<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-vue-next';
import IconContainer from '../../components/IconContainer.vue';


</script>
<template>
    <Card class="p-4 flex gap-4">
        <IconContainer>
            <Filter />
        </IconContainer>
        <div class="flex items-center gap-2 flex-wrap">
            <Badge variant="default" class="cursor-pointer">2505-0001</Badge>
            <Badge variant="outline" class="cursor-pointer">2505-0002</Badge>
            <Badge variant="outline" class="cursor-pointer">2505-0004</Badge>
            <Badge variant="outline" class="cursor-pointer">2505-0005</Badge>
        </div>
    </Card>
</template>



<style scoped></style>