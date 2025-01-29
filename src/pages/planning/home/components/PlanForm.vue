<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormItem from "@/components/ui/form/FormItem.vue";
import { Input } from "@/components/ui/input";
import type { Plan } from "@/types/planning";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import FormProductInput from "./FormProductInput.vue";
import FormProductPlanType from "./FormProductPlanType.vue";

const props = defineProps<{
  plan?: Plan;
}>();

const formSchema = toTypedSchema(
  z.object({
    sku: z.string().nonempty(),
    plan_data: z.object({
      code: z.string(),
      description: z.string().optional(),
      is_prototype: z.boolean(),
    }),
    batches: z.array(
      z.object({
        qty: z.number().int().positive(),
        start_date: z.date(),
        start_operation: z.string().nonempty(),
      }),
    ),
  }),
);
</script>
<template>
  <form
    class="grid gap-4 lg:grid-cols-[minmax(10rem,25rem),1fr]"
    @submit.prevent=""
  >
    <FormField v-slot="{ componentField }" name="sku">
      <FormItem>
        <FormLabel>Product</FormLabel>
        <FormControl>
          <FormProductInput v-bind="componentField" />
          <FormMessage />
        </FormControl>
      </FormItem>
    </FormField>
    <div class="grid rounded-md">
      <FormField v-slot="{ componentField }" name="plan_data.code">
        <FormItem>
          <FormLabel>Plan code</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
            <FormMessage />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="plan_data.description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
            <FormMessage />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="plan_data.description">
        <FormItem>
          <FormLabel>Plan type</FormLabel>
          <FormDescription
            >Choose the type of plan you wish to run in production.
          </FormDescription>
          <FormControl>
            <FormProductPlanType v-bind="componentField" />
            <FormMessage />
          </FormControl>
        </FormItem>
      </FormField>
    </div>
  </form>
</template>

<style scoped></style>
