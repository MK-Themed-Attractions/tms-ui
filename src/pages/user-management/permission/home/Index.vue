<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Roles from './components/Roles.vue';
import Permissions from './components/Permissions.vue';


</script>

<template>
    <div class="container space-y-6">
        <div>
            <h1 class="text-lg font-semibold md:text-2xl">Roles & Permissions</h1>
            <p class="text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis amet explicabo pariatur rerum
                recusandae veritatis, incidunt suscipit praesentium? Dicta omnis laboriosam quos ullam atque expedita
                consequatur sit, in amet eum!
            </p>
        </div>

        <Tabs default-value="roles">
            <TabsList class="w-full *:grow">
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="roles">
                <Roles />
            </TabsContent>
            <TabsContent value="permissions">
                <Permissions />
            </TabsContent>
        </Tabs>
    </div>
</template>


<style scoped></style>