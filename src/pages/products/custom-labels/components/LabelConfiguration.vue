<script setup lang="ts">
// Initial
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { custom, z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
// UI Tabs
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// UI Components
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHeader,
} from "@/components/ui/table";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ButtonApp } from "@/components/app/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash } from "lucide-vue-next";
// Types
import {
  LabelParameterValueList,
  type CustomLabelData,
  type LabelParameterValue,
  type Parameters,
  type LabelParameter,
} from "@/types/customLabel";
// Stores
import { useCustomLabelStore } from "@/stores/customLabelStore";
const emits = defineEmits<{
  (e: "refresh"): void;
}>();
// Declaration
const customLabelStore = useCustomLabelStore();
const { customLabel, loading } = storeToRefs(customLabelStore);
const formSchema = toTypedSchema(
  z.object({
    id: z.string(),
    title: z.string().nonempty(),
    parameters: z.array(
      z.object({
        key: z.string().nonempty(),
        desc: z.string().nonempty(),
        value: z.string().optional(),
      }),
    ),
    label_parameters: z.array(
      z.object({
        key: z.string().nonempty(),
        desc: z.string().nonempty(),
        value: z.custom<LabelParameterValue>(),
      }),
    ),
    html_code: z.string(),
  }),
);

const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    id: customLabel.value?.id,
    title: customLabel.value?.title,
    html_code: customLabel.value?.html_code,
    parameters: customLabel.value?.parameters,
    label_parameters: customLabel.value?.label_parameters,
    // custom_data: customLabel.value?.custom_data,
  },
});

const addItem = (type: string) => {
  if (type === "parameters") {
    customLabel.value?.parameters?.push({
      key: "",
      desc: "",
    });
  }
  if (type === "label_parameters") {
    customLabel.value?.label_parameters?.push({
      key: "",
      desc: "",
      value: "sku",
    });
  }
};
const removeItem = (type: string, index: number) => {
  if (type === "parameters") {
    customLabel.value?.parameters?.splice(index, 1);
  }
  if (type === "label_parameters") {
    customLabel.value?.label_parameters?.splice(index, 1);
  }
};

const onSubmit = handleSubmit(async (formValues) => {
  const payload = {
    ...formValues,
  };
  await customLabelStore.updateCustomLabel(payload);
  emits("refresh");
});

const normalizeKeyInput = (value: string): string => {
  return value
    .replace(/\s+/g, "_") // spaces → underscore
    .replace(/-/g, "_") // remove dashes
    .toUpperCase(); // all caps
};
watch(
  () => values.parameters,
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
  () => values.label_parameters,
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

<template>
  <Card class="no-border">
    <CardHeader>
      <CardTitle>Configuration</CardTitle>
      <CardDescription> Label Configuration </CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
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
      <Table class="w-full">
        <TableHeader>
          <TableRow>
            <TableCell
              class="rounded-md bg-gray-500 text-lg font-semibold text-white"
              :colspan="3"
            >
              Parameters
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead> Keyword </TableHead>
            <TableHead> Description </TableHead>
            <TableHead> Default Value </TableHead>

            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(lbl_param, index) in customLabel?.parameters"
            :key="index"
          >
            <TableCell>
              <FormField
                #default="{ componentField }"
                :name="`parameters[${index}].key`"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      :placeholder="lbl_param.key"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>
            <TableCell>
              <FormField
                #default="{ componentField }"
                :name="`parameters[${index}].desc`"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      :placeholder="lbl_param.desc"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>
            <TableCell>
              <FormField
                #default="{ componentField }"
                :name="`parameters[${index}].value`"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      :placeholder="lbl_param.value"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>
            <TableCell>
              <ButtonApp
                @click="removeItem('parameters', index)"
                size="icon"
                variant="ghost"
                class="ml-auto border"
              >
                <Trash class="stroke-rose-500" />
              </ButtonApp>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell :colspan="4">
              <ButtonApp
                @click="addItem('parameters')"
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
      <Separator class="my-2" />
      <Table class="w-full">
        <TableHeader>
          <TableRow>
            <TableCell
              class="rounded-md bg-gray-500 text-lg font-semibold text-white"
              :colspan="4"
            >
              Label Parameters
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead> Keyword </TableHead>
            <TableHead> Description </TableHead>
            <TableHead> Value </TableHead>
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(lbl_param, index) in customLabel?.label_parameters"
            :key="index"
          >
            <TableCell>
              <FormField
                #default="{ componentField }"
                :name="`label_parameters[${index}].key`"
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
                #default="{ componentField }"
                :name="`label_parameters[${index}].desc`"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      :placeholder="lbl_param.desc"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </TableCell>
            <TableCell>
              <FormField
                #default="{ componentField }"
                :name="`label_parameters[${index}].value`"
              >
                <FormItem>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger>
                        <SelectValue :placeholder="lbl_param.value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          :key="value_item"
                          v-for="(value_item, index) in LabelParameterValueList"
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
                variant="ghost"
                size="icon"
                class="border"
              >
                <Trash class="stroke-rose-500" />
              </ButtonApp>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell :colspan="4">
              <ButtonApp
                :prepend-icon="PlusCircle"
                @click="addItem('label_parameters')"
                class="ml-auto border"
                size="icon"
                variant="secondary"
              >
              </ButtonApp>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Separator class="my-2" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell
              class="rounded-md bg-gray-500 text-lg font-semibold text-white"
              :colspan="2"
            >
              Constant Parameter
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead> Keyword </TableHead>
            <TableHead> Description </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell> CurrentProductPartName </TableCell>
            <TableCell>
              Display the current product part name of the Product Item (
              default is blank )
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> CurrentProductPartNumber </TableCell>
            <TableCell>
              Display the current product part number of the Product Item (
              default is blank )
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> ProductPartCount </TableCell>
            <TableCell>
              Display the total number of part of the Product Item ( default is
              blank )
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> CurrentDate </TableCell>
            <TableCell> Display the printing date </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Separator class="my-2" />
      <FormField #default="{ componentField }" name="html_code">
        <FormItem>
          <FormLabel class="relative after:text-rose-500 after:content-['*']"
            >HTML Code (Inline CSS ONLY)</FormLabel
          >
          <FormControl>
            <Textarea
              class="min-h-[250px]"
              v-bind="componentField"
              placeholder="Type your message here."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Separator class="my-2" />
      <Accordion type="single" class="w-full rounded-sm border p-3" collapsible>
        <AccordionItem :value="'Preview'">
          <AccordionTrigger> <Label> Preview </Label></AccordionTrigger>
          <AccordionContent>
            <div v-html="customLabel?.html_code"></div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
    <CardFooter>
      <ButtonApp type="submit" @click="onSubmit" :loading="loading">
        Submit
      </ButtonApp>
    </CardFooter>
  </Card>
</template>
