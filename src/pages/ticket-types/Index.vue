<script setup lang="ts"></script>

<template>
    <div>
        <RouterView>
            <template #default="{ Component }">
                <KeepAlive exclude="TicketTypesEdit,TicketTypesCreate">
                    <component :is="Component"></component>
                </KeepAlive>
            </template>
        </RouterView>
    </div>
</template>

<style scoped></style>
