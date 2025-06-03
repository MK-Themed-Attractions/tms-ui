<template>
  <Card>
    <CardHeader>
      <FormField #default="{ componentField }" name="sku">
        <FormItem>
          <FormLabel class="relative after:text-rose-500 after:content-['*']"
            >Product SKU</FormLabel
          >
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow class="font-bold text-black">
            <TableCell> Key </TableCell>
            <TableCell> Value </TableCell>
            <TableCell class="w-[50px]"> </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow class="" v-for="(content, index) in dataSource">
            <TableCell>
              <FormField
                #default="{ componentField }"
                :name="`data.${index}.key`"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      :disabled="
                        ['client_code', 'client_desc'].includes(content.key)
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>
            <TableCell>
              <FormField
                #default="{ componentField }"
                :name="`data.${index}.value`"
              >
                <FormItem>
                  <FormControl>
                    <Input v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>
            <TableCell>
              <ButtonApp
                v-if="!['client_code', 'client_desc'].includes(content.key)"
                @click="removeKVP(index)"
                size="icon"
                variant="ghost"
                class="border"
              >
                <Trash class="stroke-rose-500" />
              </ButtonApp>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="3">
              <ButtonApp
                @click="addKVP()"
                size="icon"
                variant="secondary"
                class="ml-auto border"
              >
                <PlusCircle />
              </ButtonApp>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter>
      <ButtonApp :loading="loading" type="submit" @click="onSubmit"> Submit </ButtonApp>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
// Start of UI
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Input from "@/components/ui/input/Input.vue";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { ButtonApp } from "@/components/app/button";
import { PlusCircle, Trash } from "lucide-vue-next";
// End of UI

// Stores
import { useCustomLabelStore } from "@/stores/customLabelStore";
const customLabelStore = useCustomLabelStore();
const { customLabel, loading } = storeToRefs(customLabelStore);
// TypeScript
// Emits
const emits = defineEmits<{
  (e: "refresh"): void;
}>();
// Initial Set-up
const dataSource = ref([
  {
    key: "client_code",
    value: "",
  },
  {
    key: "client_desc",
    value: "",
  },
]);
const formSchema = toTypedSchema(
  z.object({
    custom_label_id: z.string(),
    sku: z.string().nonempty(),
    data: z.array(
      z.object({
        key: z.string().nonempty(),
        value: z.string().nonempty(),
      }),
    ),
  }),
);
const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    custom_label_id: customLabel.value?.id ?? "",
    sku: "",
    data: [...dataSource.value],
  },
});
console.log(dataSource.value);
// Function
const removeKVP = (index: number) => {
  dataSource.value.splice(index, 1);
};
const addKVP = () => {
  dataSource.value.push({
    key: "",
    value: "",
  });
};
const onSubmit = handleSubmit(async (values) => {
  const payload = {
    ...values,
  };
  const res = await customLabelStore.saveCustomLabelData(
    customLabel.value?.id ?? "",
    payload,
  );
  emits("refresh");
});
</script>
