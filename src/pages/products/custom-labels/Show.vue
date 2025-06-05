<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const props = defineProps<{
  customLabelID: string;
}>();
const emits = defineEmits<{
  (e: "refresh"): void;
}>();
import LabelConfiguration from "./components/LabelConfiguration.vue"; // import the extracted form
import LabelDataSource from "./components/LabelDataSource.vue"; // import the extracted form

import { useCustomLabelStore } from "@/stores/customLabelStore";
const customLabelStore = useCustomLabelStore();
const { customLabel } = storeToRefs(customLabelStore);

const refresh = async () => {
  if (customLabel.value) {
    await customLabelStore.getCustomLabel(customLabel.value?.id);
  }
};
</script>

<template>
  <RouterLink :to="{ name: 'customLabelList' }" class="bg-red-500 p-2 text-white rounded-md">
    Back to List
  </RouterLink>
  <Tabs default-value="configuration">
    <TabsList class="grid grid-cols-6">
      <TabsTrigger value="configuration">Configuration</TabsTrigger>
      <TabsTrigger value="dataConfiguration">Data Source</TabsTrigger>
    </TabsList>

    <!-- Form Tab -->
    <TabsContent value="configuration">
      <KeepAlive>
        <LabelConfiguration @refresh="refresh()" />
      </KeepAlive>
    </TabsContent>

    <!-- Data Source Tab -->
    <TabsContent value="dataConfiguration">
      <KeepAlive>
        <LabelDataSource @refresh="refresh()" />
      </KeepAlive>
    </TabsContent>
  </Tabs>
</template>
