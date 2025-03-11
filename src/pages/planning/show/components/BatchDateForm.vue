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
import { useAuthStore } from "@/stores/authStore";
import { usePlanStore } from "@/stores/planStore";
import type { PlanBatch } from "@/types/planning";
import { toTypedSchema } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

const props = defineProps<{
  batch: PlanBatch;
}>();
const emits = defineEmits<{
  (e: "submited"): void;
}>();

const planStore = usePlanStore();
const authStore = useAuthStore()
const { errors } = storeToRefs(planStore);

const { dateLoading, dateSubmit } = useDate();

function useDate() {
  const dateLoading = ref(false);
  const { user } = storeToRefs(authStore)
  const dateFormSchema = toTypedSchema(
    z.object({
      start_date: z.string().nonempty("Required").refine((date) => {
        const inputDate = new Date(date)
        const today = new Date()

        today.setHours(0, 0, 0, 0)
        inputDate.setHours(0, 0, 0, 0)

        return inputDate >= today;
      }, {
        message: 'Please select today or a future date.',
      }),
      user_id: z.string().default(user.value.id)
    }),
  );
  const { handleSubmit, setFieldValue } = useForm({
    name: "dateForm",
    validationSchema: dateFormSchema,
  });

  const dateSubmit = handleSubmit(async (values) => {
    dateLoading.value = true;
    await planStore.updatePlanBatch(
      props.batch.plan_id,
      props.batch.id,
      values,
    );
    await planStore.getPlan(props.batch.plan_id, {
      includes: "batches",
    });

    if (!errors.value) {
      toast("Batch notice", {
        description: "Batch start date is being processed. Please wait",
      });

      emits("submited");
    } else {
      toast.error("Batch notice", {
        description: "Something went wrong while changing plan start date",
      });
    }
    dateLoading.value = false;
  });

  setFieldValue("start_date", props.batch.start_date.split("T")[0]);

  return {
    dateLoading,
    dateSubmit,
  };
}
</script>
<template>
  <form class="space-y-4" @submit.prevent="dateSubmit">
    <FormField v-slot="{ componentField }" name="start_date">
      <FormItem>
        <FormLabel>Start date</FormLabel>
        <FormControl>
          <Input type="date" v-bind="componentField" />
        </FormControl>
        <FormDescription>Date from which batch should be assignable.</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <ButtonApp type="submit" class="ml-auto" :loading="dateLoading">Change Date</ButtonApp>
  </form>
</template>

<style scoped></style>
