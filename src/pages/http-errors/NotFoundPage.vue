<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { HttpCode, HttpCodeDescription, HttpCodeTitle } from '@/components/app/http-code';
import { Home } from 'lucide-vue-next';


</script>

<template>
    <HttpCode>
        <HttpCodeTitle>404</HttpCodeTitle>
        <HttpCodeDescription>We couldn't find the page you're looking for.</HttpCodeDescription>
        <ButtonApp as-child>
            <RouterLink :to="{ name: 'home' }" class="w-fit mx-auto">
                <Home />
                Home
            </RouterLink>
        </ButtonApp>
    </HttpCode>
</template>


<style scoped></style>