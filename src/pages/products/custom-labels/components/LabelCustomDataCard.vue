<template>
  <Card>
    <CardHeader>
      <FormField #default="{ componentField }" name="sku">
        <FormItem>
          <FormLabel class="relative after:text-rose-500 after:content-['*']">Product SKU</FormLabel>
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
          <TableRow class="" v-for="(content, index) in customLabel.custom_data[sumIndex].data">
            <TableCell>
              <FormField #default="{ componentField }" :name="`data.${index}.key`">
                <FormItem>
                  <FormControl>
                    <Input v-bind="componentField" :disabled="['client_code', 'client_desc'].includes(content.key)
                      " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>
            <TableCell>
              <FormField #default="{ componentField }" :name="`data.${index}.value`">
                <FormItem>
                  <FormControl>
                    <Input v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>
            <TableCell>
              <ButtonApp v-if="!['client_code', 'client_desc'].includes(content.key)" @click="removeKVP(index)"
                variant="ghost" size="icon" class="border">
                <Trash class="stroke-rose-500" />
              </ButtonApp>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan="3">
              <ButtonApp @click="addKVP()" variant="secondary" size="icon" class="border ml-auto">
                <PlusCircle />
              </ButtonApp>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter>
      <ButtonApp type="submit" @click="onSubmit">
        Submit
      </ButtonApp>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { reactive, watch, toRefs, emits } from "vue";
import { storeToRefs } from "pinia";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
// Start of UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Input from "@/components/ui/input/Input.vue";
import {
  Table,
  TableBody,
  TableHead,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ButtonApp } from "@/components/app/button";
import { PlusCircle, Trash } from "lucide-vue-next";
// End of UI

// Stores
import { useCustomLabelStore } from "@/stores/customLabelStore";
const customLabelStore = useCustomLabelStore();
const { customLabel } = storeToRefs(customLabelStore);
// TypeScript
import { type CustomLabelData } from "@/types/customLabel.ts";
// Props and Emits
const emits = defineEmits<{
  (e: "refresh"): void;
}>();
const props = defineProps<{
  sumIndex: null;
}>();

// Initial Set-up
const formSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    custom_label_id: z.string().optional(),
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
    id: customLabel.value.custom_data[props?.sumIndex].id,
    custom_label_id:
      customLabel.value.custom_data[props?.sumIndex].custom_label_id,
    sku: customLabel.value.custom_data[props?.sumIndex].sku,
    data: customLabel.value.custom_data[props?.sumIndex].data ?? [],
  },
});
// Function
const removeKVP = (index) => {
  customLabel.value.custom_data[props?.sumIndex].data.splice(index, 1);
};
const addKVP = () => {
  customLabel.value.custom_data[props?.sumIndex].data.push({
    key: "",
    value: "",
  });
};
const onSubmit = handleSubmit(async (values) => {
  const res = await customLabelStore.updateCustomLabelData(values.id, values);
  emits("refresh");
});
</script>
