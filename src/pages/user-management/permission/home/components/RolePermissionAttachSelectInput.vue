<script setup lang="ts">
import { ButtonApp } from '@/components/app/button';
import { MultiSelect } from '@/components/app/multi-select/Index';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSimplePaginate } from '@/composables/usePaginate';
import { routingMicroservices } from '@/microservice';
import { useAuthStore } from '@/stores/authStore';
import type { Permission, PermissionAttachMicroservicePayload } from '@/types/auth';
import { Plus, Trash } from 'lucide-vue-next';
import { ref, watchEffect } from 'vue';

const props = defineProps<{
    modelValue?: PermissionAttachMicroservicePayload[],
    rolePermissions?: PermissionAttachMicroservicePayload[]
}>()
const emits = defineEmits<{
    (e: 'update:modelValue', model: PermissionAttachMicroservicePayload[]): void
}>()
const authStore = useAuthStore()
const inputs = ref<(PermissionAttachMicroservicePayload & { id?: string })[]>([])
const { fetchPermissions, permissions } = usePaginate()

/* if role permissions already exists */
if (props.rolePermissions) {
    /* transform it to have ID first */
    inputs.value = props.rolePermissions.map((rp) => {
        return {
            ...rp,
            id: Math.random().toString()
        }
    })
}

watchEffect(() => {
    const inputWithoutId = inputs.value.map(i => {
        return {
            name: i.name,
            permissions: i.permissions
        }
    })
    emits('update:modelValue', JSON.parse(JSON.stringify(inputWithoutId)))
})

function removeInput(id: string | undefined) {
    if (!id) return;
    inputs.value = inputs.value.filter(input => input.id !== id)
}

function usePaginate() {
    const { items: permissions, paginate } = useSimplePaginate<Permission>()

    async function fetchPermissions() {
        paginate.value = await authStore.getPermissions({
            pages: '999999'
        })
    }

    return {
        permissions,
        fetchPermissions
    }
}

/* INIT */
if (!permissions.value) {
    await fetchPermissions()
}
</script>

<template>
    <ul class="space-y-2">
        <li v-for="input in inputs" :key="input.id"
            class="flex flex-wrap items-center gap-2 border border-dashed p-2 rounded-md">
            <Select v-model="input.name">
                <SelectTrigger class="flex-1">
                    <SelectValue class="capitalize " />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="microservice in routingMicroservices" :key="microservice" :value="microservice"
                        class="capitalize">
                        {{ microservice }}
                    </SelectItem>
                </SelectContent>
            </Select>
            <MultiSelect v-if="permissions" v-model="input.permissions" :items="permissions" value-key="name"
                return-key="id" placeholder="Select permissions" class="flex-1">
            </MultiSelect>
            <ButtonApp size="icon" variant="ghost" class="ml-auto" @click="removeInput(input.id)">
                <Trash />
            </ButtonApp>
        </li>
        <ButtonApp size="icon" variant="secondary"
            @click.stop="inputs.push({ id: Math.random().toString(), name: 'common', permissions: [] })">
            <Plus />
        </ButtonAPp>
    </ul>
</template>


<style scoped></style>