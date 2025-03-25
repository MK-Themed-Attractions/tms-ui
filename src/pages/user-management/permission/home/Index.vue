<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, } from '@/components/app/loader';




</script>

<template>
    <div class="container space-y-6">
        <div>
            <h1 class="text-lg font-semibold md:text-2xl">Roles & Permissions</h1>
            <p class="text-muted-foreground text-sm">
                Manage roles and permissions: View, add, edit, or delete roles and permissions with ease.
            </p>
        </div>

        <Tabs default-value="roles">
            <TabsList class="w-full">
                <RouterLink :to="{ name: 'roles' }" class="grow">
                    <TabsTrigger value="roles" class="w-full">
                        Roles
                    </TabsTrigger>
                </RouterLink>
                <RouterLink :to="{ name: 'permissions' }" class="grow">
                    <TabsTrigger value="permissions" class="w-full">
                        Permissions
                    </TabsTrigger>
                </RouterLink>
            </TabsList>

            <div class="mt-2">
                <RouterView v-slot="{ Component }">
                    <template v-if="Component">
                        <Suspense timeout="0">
                            <!-- main content -->
                            <component :is="Component"></component>

                            <!-- loading state -->
                            <template #fallback>
                                <Loader class="min-h-[20vh]" description="Loading, please wait..." />
                            </template>
                        </Suspense>
                    </template>
                </RouterView>
            </div>

        </Tabs>
    </div>
</template>


<style scoped></style>