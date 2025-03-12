<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Plan } from "@/types/planning";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import FormProductPlanType from "../../create/components/FormProductPlanType.vue";
import { ButtonApp } from "@/components/app/button";
import { usePlanStore } from "@/stores/planStore";
import { toast } from "vue-sonner";
import { storeToRefs } from "pinia";
import { ref, watch, watchEffect } from "vue";

const props = defineProps<{
  plan: Plan;
}>();
const dialog = defineModel({ default: false });
const planStore = usePlanStore();
const { errors: planErrors, loading } = storeToRefs(planStore);

const formSchema = toTypedSchema(
  z.object({
    plan_data: z.object({
      code: z.string().nonempty("Required"),
      description: z
        .string()
        .optional()
        .nullable()
        .default(props.plan.plan_data.description),
      is_prototype: z.boolean(),
    }),
  }),
);

const { handleSubmit, setValues } = useForm({
  validationSchema: formSchema,
});

const submit = handleSubmit(async (values) => {
  await planStore.updatePlanData(props.plan.id, values);

  if (!planErrors.value) {

    /* display a toast message */
    toast.info("Plan update in process", {
      description: "Plan update is being processed, please wait.",
    });

    /* close the dialog */
    dialog.value = false;
  } else {
    toast("Error", {
      description: "Something went wrong.",
    });
  }
});

watchEffect(() => {
  setValues({
    plan_data: {
      code: props.plan.plan_data.code,
      description: props.plan.plan_data.description,
      is_prototype: props.plan.plan_data.is_prototype,
    }
  })
})
</script>
<template>
  <Dialog v-model:open="dialog">
    <DialogContent @interact-outside="(e) => e.preventDefault()">
      <DialogHeader>
        <DialogTitle>Edit plan</DialogTitle>
        <DialogDescription>Edit basic information, once the plan is moving, you are not able to
          edit this information</DialogDescription>
      </DialogHeader>

      <form @submit="submit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="plan_data.code">
          <FormItem>
            <FormLabel>Code</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="plan_data.description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="plan_data.is_prototype">
          <FormItem>
            <FormLabel>Plan type</FormLabel>
            <FormControl>
              <FormProductPlanType v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <ButtonApp type="submit" :loading="loading">Update</ButtonApp>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
