<template>
  <div class="space-y-4">
    <SectionHeader
      title="Custom Label"
      description="Configuration for Custom Label"
    />

    <div class="flex flex-col gap-2">
      <!-- Title -->
      <FormField #default="{ componentField }" name="title">
        <FormItem>
          <FormLabel class="relative after:text-rose-500 after:content-['*']"
            >Title</FormLabel
          >
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Separator class="my-2" />

      <!-- Parameters -->
      <div>
        <h3 class="font-semibold">Parameters</h3>
        <Table class="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default Value</TableHead>

              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(param, index) in values.parameters" :key="index">
              <TableCell>
                <FormField
                  :name="`parameters[${index}].key`"
                  #default="{ componentField }"
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
                <FormField
                  :name="`parameters[${index}].desc`"
                  #default="{ componentField }"
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
                <FormField
                  :name="`parameters[${index}].value`"
                  #default="{ componentField }"
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
                  @click="removeItem('parameters', index)"
                  class="border"
                  size="icon"
                  variant="ghost"
                >
                  <Trash class="stroke-rose-500" />
                </ButtonApp>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell :colspan="4">
                <ButtonApp
                  @click="addItem('parameters')"
                  class="ml-auto border"
                  size="icon"
                  variant="secondary"
                >
                  <PlusCircle />
                </ButtonApp>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Separator class="my-2" />

      <!-- Label Parameters -->
      <div>
        <h3 class="font-semibold">Label Parameters</h3>
        <Table class="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Value</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(lbl_param, index) in values.label_parameters"
              :key="index"
            >
              <TableCell>
                <FormField
                  :name="`label_parameters[${index}].key`"
                  #default="{ componentField }"
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
                <FormField
                  :name="`label_parameters[${index}].desc`"
                  #default="{ componentField }"
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
                <FormField
                  :name="`label_parameters[${index}].value`"
                  #default="{ componentField }"
                >
                  <FormItem>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="value_item in Object.values(
                              LabelParameterValueList,
                            )"
                            :key="value_item"
                            :value="value_item"
                          >
                            {{ value_item }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </TableCell>
              <TableCell class="w-fit">
                <ButtonApp
                  @click="removeItem('label_parameters', index)"
                  class="border"
                  size="icon"
                  variant="ghost"
                >
                  <Trash class="stroke-rose-500" />
                </ButtonApp>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell :colspan="4">
                <ButtonApp
                  @click="addItem('label_parameters')"
                  class="ml-auto border"
                  size="icon"
                  variant="secondary"
                >
                  <PlusCircle />
                </ButtonApp>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Separator class="my-2" />

      <!-- HTML Code -->
      <FormField #default="{ componentField }" name="html_code">
        <FormItem>
          <FormLabel class="relative after:text-rose-500 after:content-['*']"
            >HTML Code</FormLabel
          >
          <FormControl>
            <Textarea
              v-bind="componentField"
              placeholder="Type your HTML code here."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Buttons -->
      <div class="mt-4 flex justify-between gap-2">
        <ButtonApp type="submit" @click="onSubmit"> Submit </ButtonApp>
        <RouterLink
          :to="{ name: 'customLabelList' }"
          class="rounded-md bg-red-500 p-2 text-white"
        >
          Cancel
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { LabelParameterValueList } from "@/types/customLabel";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ButtonApp } from "@/components/app/button";
import { PlusCircle, Trash } from "lucide-vue-next";
import { watch } from "vue";

// Zod Schemas
const parameterSchema = z.object({
  key: z.string().nonempty(),
  desc: z.string().nonempty(),
  value: z.string().optional()
});

const labelParameterSchema = z.object({
  key: z.string().nonempty(),
  desc: z.string().nonempty(),
  value: z.nativeEnum(LabelParameterValueList, {
    errorMap: () => ({ message: "Invalid value" }),
  }),
});

const customLabelSchema = z.object({
  title: z.string().min(1, "Title is required"),
  html_code: z.string().min(1, "HTML code is required"),
  parameters: z.array(parameterSchema).optional(),
  label_parameters: z.array(labelParameterSchema).optional(),
});

const formSchema = toTypedSchema(customLabelSchema);

const { handleSubmit, values, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: "",
    html_code: "",
    parameters: [],
    label_parameters: [],
  },
});

const addItem = (type: "parameters" | "label_parameters") => {
  const newItem =
    type === "parameters"
      ? { key: "", desc: "" }
      : { key: "", desc: "", value: "sku" };

  setValues({
    ...values,
    [type]: [...(values[type] || []), newItem],
  });
};

const removeItem = (type: "parameters" | "label_parameters", index: number) => {
  const updatedArray = [...(values[type] || [])];
  updatedArray.splice(index, 1);

  setValues({
    ...values,
    [type]: updatedArray,
  });
};
import { storeToRefs } from "pinia";

import { useCustomLabelStore } from "@/stores/customLabelStore";
const customLabelStore = useCustomLabelStore();
import { useRouter } from "vue-router";
import { SectionHeader } from "@/components/app/section-header";
const router = useRouter();

// Submit handler
const onSubmit = handleSubmit(async (formValues) => {
  // Ensure required fields are present and not undefined
  const payload = {
    title: values.title ?? "",
    html_code: values.html_code ?? "",
    parameters: values.parameters ?? [],
    label_parameters: values.label_parameters ?? [],
  };
  const res = await customLabelStore.saveCustomLabel(payload);
  router.push({ name: "customLabelList" });
});
const normalizeKeyInput = (value: string): string => {
  return value
    .replace(/\s+/g, "_") // spaces → underscore
    .replace(/-/g, "_") // remove dashes
    .toUpperCase(); // all caps
};
watch(
  () => values?.parameters,
  (newVal) => {
    if (newVal) {
      newVal.forEach((param, index) => {
        if (param.key) {
          param.key = normalizeKeyInput(param.key);
        }
      });
    }
  },
  { deep: true },
);

watch(
  () => values?.label_parameters,
  (newVal) => {
    if (newVal) {
      newVal.forEach((param, index) => {
        if (param.key) {
          param.key = normalizeKeyInput(param.key);
        }
      });
    }
  },
  { deep: true },
);
</script>
