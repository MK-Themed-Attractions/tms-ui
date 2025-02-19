<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePlanStore } from "@/stores/planStore";
import type { PlanBatch } from "@/types/planning";
import { toTypedSchema } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import FormRoutingSelectInput from "../../create/components/FormRoutingSelectInput.vue";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";

const props = defineProps<{
  batch: PlanBatch;
}>();
const emits = defineEmits<{
  (e: "submited"): void;
}>();
const planStore = usePlanStore();
const { errors } = storeToRefs(planStore);
const productStore = useProductStore();
const { product } = storeToRefs(productStore);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const taskLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    qty: z.number().int().positive(),
    start_operation: z.string().nonempty("Required"),
    user_id: z.string().default(user.value.id),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const submit = handleSubmit(async (values) => {
  taskLoading.value = true;
  await planStore.appendTask(props.batch.plan_id, props.batch.id, values);

  if (!errors.value) {
    toast("Task notice", {
      description:
        "Added tasks are being processed. We will notify you once it is done.",
    });

    emits("submited");
  } else
    toast.error("Task failed notice", {
      description:
        "Something went wrong while added task. Please try again later.",
    });
  taskLoading.value = false;
});
</script>
<template>
  <form @submit.prevent="submit">
    <FormField #default="{ componentField }" name="qty">
      <FormItem>
        <FormLabel>Task Quantity</FormLabel>
        <FormControl>
          <Input type="number" v-bind="componentField" />
        </FormControl>
        <FormDescription
          >Amount of task to be added on this batch.</FormDescription
        >
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField #default="{ componentField }" name="start_operation">
      <FormItem>
        <FormLabel>Start route</FormLabel>
        <FormControl>
          <FormRoutingSelectInput
            v-if="product && product.routings"
            v-bind="componentField"
            :routings="product.routings"
          />
        </FormControl>
        <FormDescription
          >Amount of task to be added on this batch.</FormDescription
        >
        <FormMessage />
      </FormItem>
    </FormField>

    <ButtonApp type="submit" class="ml-auto" :loading="taskLoading"
      >Add tasks</ButtonApp
    >
  </form>
</template>

<style scoped></style>
