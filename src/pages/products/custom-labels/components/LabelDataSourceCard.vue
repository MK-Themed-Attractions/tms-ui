<template>
  <Card>
    <CardHeader>
      <FormField #default="{ componentField }" name="sku">
        <FormItem>
          <FormLabel class="relative after:text-rose-500 after:content-['*']">
            Product SKU
          </FormLabel>
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
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
            <TableCell class="w-[50px]"></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(field, index) in fields" :key="field.key">
            <TableCell>
              <FormField :name="`data.${index}.key`" #default="{ componentField }">
                <FormItem>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger>
                        <SelectValue :placeholder="(formValues.data ?? [])[index]?.key || 'Select Key'" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="(item, idx) in LabelParameterValueList"
                          :key="idx"
                          :value="item"
                        >
                          {{ item }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>

            <TableCell>
              <FormField :name="`data.${index}.value`" #default="{ componentField }">
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
                @click="remove(index)"
                variant="ghost"
                size="icon"
                class="border"
              >
                <Trash class="stroke-rose-500" />
              </ButtonApp>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colspan="3">
              <ButtonApp
                @click="addKVP"
                :disabled="!canAdd"
                variant="secondary"
                size="icon"
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
      <ButtonApp :loading="loading" type="submit" @click="onSubmit">
        Submit
      </ButtonApp>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, useFieldArray } from "vee-validate";

// UI
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonApp } from "@/components/app/button";
import { PlusCircle, Trash } from "lucide-vue-next";

// Store
import { useCustomLabelStore } from "@/stores/customLabelStore";
const customLabelStore = useCustomLabelStore();
const { customLabel, loading } = storeToRefs(customLabelStore);

// Types
import { LabelParameterValueList } from "@/types/customLabel";

// Props
const props = defineProps<{
  mode: "create" | "edit";
  sumIndex?: number;
}>();
const emits = defineEmits<{
  (e: "refresh"): void;
}>();

// Utilities
const generateId = () => Math.random().toString(36).substring(2, 10);

// Get initial data
const getInitialData = () => {
  if (props.mode === "edit" && props.sumIndex != null) {
    return (
      customLabel.value?.custom_data?.[props.sumIndex]?.data || []
    );
  }
  return [{ key: "", value: "" }];
};

// Schema
const formSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    custom_label_id: z.string().optional(),
    sku: z.string().nonempty("SKU is required"),
    data: z
      .array(
        z.object({
          key: z.string().nonempty("Key is required"),
          value: z.string().nonempty("Value is required"),
        })
      )
      .refine(
        (items) => {
          const keys = items.map((i) => i.key);
          return new Set(keys).size === keys.length;
        },
        { message: "Duplicate keys are not allowed", path: ["data"] }
      ),
  })
);

// Form setup
const { handleSubmit, values: formValues, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    id:
      props.mode === "edit"
        ? customLabel.value?.custom_data?.[props.sumIndex!]?.id
        : undefined,
    custom_label_id:
      props.mode === "edit"
        ? customLabel.value?.custom_data?.[props.sumIndex!]?.custom_label_id
        : customLabel.value?.id ?? "",
    sku:
      props.mode === "edit"
        ? customLabel.value?.custom_data?.[props.sumIndex!]?.sku
        : "",
    data: getInitialData(),
  },
});

const { fields, push, remove } = useFieldArray("data");

// Button guard: allow add only if all fields are filled
const canAdd = computed(() =>
  (formValues.data ?? []).every((item) => item.key && item.value)
);

// Add new key-value pair
const addKVP = () => {
  push({ key: "", value: "" });
};

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  const payload = {
    ...values,
    custom_label_id: values.custom_label_id ?? "",
  };

  if (props.mode === "edit") {
    await customLabelStore.updateCustomLabelData(values.id!, payload);
  } else {
    await customLabelStore.saveCustomLabelData(payload.custom_label_id, payload);
    // Reset form after creation
    resetForm({
      values: {
        sku: "",
        id: undefined,
        custom_label_id: customLabel.value?.id ?? "",
        data: [{ key: "", value: "" }],
      },
    });
  }

  emits("refresh");
});
</script>
