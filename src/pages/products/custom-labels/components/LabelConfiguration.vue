<script setup lang="ts">
// Initial
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { custom, z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
// UI Tabs
import { Button } from "@/components/ui/button";
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
//
const emits = defineEmits<{
  (e: "refresh"): void;
}>();
// Declaration
const customLabelStore = useCustomLabelStore();
const { customLabel } = storeToRefs(customLabelStore);
const formSchema = toTypedSchema(
  z.object({
    id: z.string(),
    title: z.string().nonempty(),
    parameters: z.array(
      z.object({
        key: z.string().nonempty(),
        desc: z.string().nonempty(),
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

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    id: customLabel.value?.id,
    title: customLabel.value?.title,
    html_code: customLabel.value?.html_code,
    parameters: customLabel.value?.parameters,
    label_parameters: customLabel.value?.label_parameters,
    custom_data: customLabel.value?.custom_data,
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

const onSubmit = handleSubmit(async (values) => {
  await customLabelStore.updateCustomLabel(values);
  emits("refresh");
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Configuration</CardTitle>
      <CardDescription> Label Configuration </CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
      <FormField #default="{ componentField }" name="title">
        <FormItem>
          <FormLabel class="relative after:text-rose-500 after:content-['*']">Title</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Separator class="my-2" />
      <div>
        <h3 class="font-semibold">Parameters</h3>
        <Table class="w-full">
          <TableHeader>
            <TableRow>
              <TableHead> Keyword </TableHead>
              <TableHead> Description </TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(lbl_param, index) in customLabel?.parameters" :key="index">
              <TableCell>
                <FormField #default="{ componentField }" :name="`parameters[${index}].key`">
                  <FormItem>
                    <!-- <FormLabel
                    class="relative after:text-rose-500 after:content-['*']"
                    >Keyword
                  </FormLabel> -->
                    <FormControl>
                      <Input v-bind="componentField" :placeholder="lbl_param.key" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </TableCell>
              <TableCell>
                <FormField #default="{ componentField }" :name="`parameters[${index}].desc`">
                  <FormItem>
                    <FormControl>
                      <Input v-bind="componentField" :placeholder="lbl_param.desc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </TableCell>
              <TableCell>
                <ButtonApp @click="removeItem('parameters', index)" size="icon" variant="ghost" class="border ">
                  <Trash class="stroke-rose-500" />
                </ButtonApp>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell :colspan="3">
                <ButtonApp @click="addItem('parameters')" size="icon" variant="secondary" class="border ml-auto">
                  <PlusCircle />
                </ButtonApp>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Separator class="my-2" />
      <div>
        <h3 class="font-semibold">Label Parameters</h3>
        <Table class="w-full">
          <TableHeader>
            <TableRow>
              <TableHead> Keyword </TableHead>
              <TableHead> Description </TableHead>
              <TableHead> Value </TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(lbl_param, index) in customLabel?.label_parameters" :key="index">
              <TableCell>
                <FormField #default="{ componentField }" :name="`label_parameters[${index}].key`">
                  <FormItem>
                    <FormControl>
                      <Input v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </TableCell>
              <TableCell>
                <FormField #default="{ componentField }" :name="`label_parameters[${index}].desc`">
                  <FormItem>
                    <!-- <FormLabel
                    class="relative after:text-rose-500 after:content-['*']"
                    >Description</FormLabel
                  > -->
                    <FormControl>
                      <Input v-bind="componentField" :placeholder="lbl_param.desc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </TableCell>
              <TableCell>
                <FormField #default="{ componentField }" :name="`label_parameters[${index}].value`">
                  <FormItem>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger>
                          <SelectValue :placeholder="lbl_param.value" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem :key="value_item" v-for="(
value_item, index
                            ) in LabelParameterValueList" :value="value_item">
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
                <ButtonApp @click="removeItem('label_parameters', index)" variant="ghost" size="icon" class="border">
                  <Trash class="stroke-rose-500" />
                </ButtonApp>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell :colspan="4">
                <ButtonApp :prepend-icon="PlusCircle" @click="addItem('label_parameters')" class="ml-auto border"
                  size="icon" variant="secondary">
                </ButtonApp>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Separator class="my-2" />
      <div>
        <FormField #default="{ componentField }" name="html_code">
          <FormItem>
            <FormLabel class="relative after:text-rose-500 after:content-['*']">HTML Code</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" placeholder="Type your message here." />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div>
        <div class="avoid-break mx-auto my-4 flex max-w-[8.5in] flex-wrap border p-2">
          <!-- Left Column -->
          <div class="w-1/2 p-1">
            <img src="" loading="lazy" class="m-1 w-full" />
          </div>

          <!-- Right Column -->
          <div class="w-1/2 p-1">
            <table class="w-full table-fixed text-[12px]">
              <tr>
                <td class="w-full border-2 border-black bg-black p-1 text-left uppercase text-white">
                  PART NUMBER / BARCODE:
                </td>
                <td class="border-0"></td>
                <td></td>
              </tr>
              <tr>
                <td rowspan="2" class="border-2 border-black text-left text-[36px] uppercase">
                  <img class="h-[50px] w-full" src="" />
                </td>
                <td class="border-0"></td>
                <td class="border-2 border-black bg-black py-[3px] text-center text-white">
                  Factory Number
                </td>
              </tr>
              <tr>
                <td class="border-0"></td>
                <td class="border-2 border-black text-center font-bold"></td>
              </tr>
            </table>
          </div>

          <!-- Full Width Section -->
          <div class="mt-2 w-full">
            <div class="flex flex-wrap">
              <!-- Left Side -->
              <div class="w-5/12 px-2">
                <div class="mb-2 h-[2.02in] max-h-[2.02in] border-2 border-black p-2">
                  <p class="w-full bg-black p-1 uppercase text-white">
                    Description / Name:
                  </p>
                  <p class="w-full text-center">product_skuASDAS</p>
                </div>
                <div class="border-2 border-black">
                  <div class="my-2">
                    <p class="mb-2 bg-black p-1 text-center uppercase text-white">
                      Height (IN) width (in) length (in):
                    </p>
                    <p class="m-0 text-center"></p>
                  </div>
                  <div class="my-2">
                    <p class="mb-2 bg-black p-1 text-center uppercase text-white">
                      Weight (lbs):
                    </p>
                    <p class="m-0 text-center"></p>
                  </div>
                </div>
              </div>

              <!-- Right Side -->
              <div class="w-7/12 px-2">
                <div class="border-2 border-black p-2">
                  <p class="w-full bg-black p-1 uppercase text-white">Image:</p>
                  <div class="flex justify-center py-1">
                    <img class="h-[1.5in]" src="" />
                  </div>
                  <div class="pb-1">
                    <table class="w-full table-fixed text-[12px]">
                      <tr>
                        <td class="border-2 border-black bg-black uppercase text-white">
                          Notes
                        </td>
                        <td class="w-[5%] border-0"></td>
                        <td class="w-[30%] border-0"></td>
                      </tr>
                      <tr>
                        <td rowspan="3" class="border-2 border-black"></td>
                        <td class="border-0"></td>
                        <td class="border-0"></td>
                      </tr>
                      <tr>
                        <td class="border-0"></td>
                        <td class="border-0 bg-black uppercase text-white">
                          Date:
                        </td>
                      </tr>
                      <tr>
                        <td class="border-0"></td>
                        <td class="border-0 text-center"></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <ButtonApp type="submit" @click="onSubmit">
        Submit
      </ButtonApp>
    </CardFooter>
  </Card>
</template>
