<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuGroup from '@/components/ui/dropdown-menu/DropdownMenuGroup.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import { useSimplePaginate } from '@/composables/usePaginate';
import { formatReadableDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import type { GetNotificationsQueryParams, Notification, NotificationType } from '@/types/notification';
import { Bell, Calendar, Home, LoaderCircle, Plus, StickyNote } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';



const notificationStore = useNotificationStore()
const { loading } = storeToRefs(notificationStore)
const page = ref(1)
const { hasNextPage, items: notifications, paginate } = useSimplePaginate<Notification>()
const authStore = useAuthStore()
const { userOperationCodesPermissions, user } = storeToRefs(authStore)

const adminKeys = <string[]>JSON.parse(import.meta.env.VITE_SUPERADMIN_IDS)
const isAdmin = adminKeys.includes(user.value.id)

const queryParams = computed(() => {
    const params: GetNotificationsQueryParams = { page: String(page.value) }
    if (!isAdmin)
        params.user_id = userOperationCodesPermissions.value
    return params
})

if (!notifications.value)
    paginate.value = (await notificationStore.getNotifications(queryParams.value))?.data

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'plan create':
            return Calendar
        case 'task create':
            return StickyNote
        default:
            return Bell
    }
}

const fetchNextNotifications = async () => {
    page.value++
    const nextNotifications = (await notificationStore.getNotifications(queryParams.value))?.data.data
    if (nextNotifications)
        notifications.value?.push(...nextNotifications)
}


</script>
<template>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button size="icon" variant="secondary" class="rounded-full relative">
                <Bell />
                <Badge class="absolute top-1 right-1 size-2 p-0 " variant="destructive" />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="max-w-xl max-h-[80vh] overflow-auto min-w-[30rem]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuGroup class="space-y-2">
                <DropdownMenuItem v-if="notifications" v-for="notification in notifications" :key="notification.id"
                    class="border items-start">
                    <component :is="getNotificationIcon(notification.type)" class="mt-2" />
                    <div class="grow">
                        <p class="font-medium uppercase">{{ notification.type }}</p>
                        <p>{{ notification.data.message }}</p>
                        <p class="text-muted-foreground mt-1 text-end">{{ formatReadableDate(notification.created_at) }}
                        </p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div class="text-center">
                    <Button @click="fetchNextNotifications" :disabled="!hasNextPage">
                        <LoaderCircle class="animate-spin" v-if="loading" />
                        Load more
                    </Button>
                </div>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>


<style scoped></style>