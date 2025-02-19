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
import type { Plan, PlanForm } from "@/types/planning";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import FormProductInput from "./components/FormProductInput.vue";
import FormProductPlanType from "./components/FormProductPlanType.vue";
import { useFieldArray, useForm } from "vee-validate";
import { ButtonApp } from "@/components/app/button";
import { Info, Plus, Trash, TriangleAlert } from "lucide-vue-next";

import { useProductStore } from "@/stores/productStore";
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { Textarea } from "@/components/ui/textarea";
import FormRoutingSelectInput from "./components/FormRoutingSelectInput.vue";
import FormSubmitButton from "./components/FormSubmitButton.vue";
import { Label } from "@/components/ui/label";
import { usePlanStore } from "@/stores/planStore";
import { toast } from "vue-sonner";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import PlanFormReviewDialog from "./components/PlanFormReviewDialog.vue";

const props = defineProps<{
  plan?: Plan;
}>();
const productStore = useProductStore();
const { product, filteredRoutings } = storeToRefs(productStore);
const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const showConfirmationDialog = ref(false);

const formSchema = toTypedSchema(
  z.object({
    sku: z.string().nonempty("Required").default(""),
    plan_data: z.object({
      code: z.string().nonempty("Required").default(""),
      description: z.string().optional(),
      is_prototype: z.boolean().default(false),
    }),
    batches: z
      .array(
        z.object({
          qty: z.number().int().positive(),
          start_date: z.coerce.date(),
          start_operation: z.string().nonempty("Required").default(""),
        }),
      )
      .nonempty("Must have atleast 1 batch"),
    user_id: z.string().default(user.value.id || ""),
  }),
);

const {
  handleSubmit,
  errors,
  controlledValues,
  validate,
  values: planFormValues,
  handleReset,
} = useForm({
  validationSchema: formSchema,
});
const { handleAddBatch, batchFields, handleRemoveBatch } = useBatch();
const { handleCreatePlan, planLoading } = usePlan();
const { handlePlanReviewConfirmed, handleReviewAndAdd } = useReviewAndAdd();

const submit = handleSubmit(async (values) => {
  await handleCreatePlan(<PlanForm>values);
});

function useBatch() {
  const {
    push: addBatch,
    remove: removeBatch,
    fields: batchFields,
  } = useFieldArray("batches");

  /* reset the batch fields whenever the SKU becomes blank,
  means the user press the switch button */

  watchEffect(() => {
    if (!controlledValues.value.sku) {
      batchFields.value = [];
    }
  });

  function handleAddBatch() {
    addBatch({
      qty: 1,
      start_date: new Date(Date.now()).toISOString().split("T")[0],
      start_operation: "",
    });
  }

  function handleRemoveBatch(index: number) {
    removeBatch(index);
  }

  return {
    handleAddBatch,
    batchFields,
    handleRemoveBatch,
  };
}

function usePlan() {
  const planStore = usePlanStore();
  const { errors: planErrors, loading: planLoading } = storeToRefs(planStore);

  async function handleCreatePlan(form: PlanForm) {
    await planStore.createPlan(form);

    if (!planErrors.value) {
      toast("Processing", {
        description:
          "The plan is being processed. We will notify you once it is complete.",
      });
    } else {
      toast("Plan failed notice", {
        description: "There's a problem creating plan. Please try again.",
      });
    }

    router.push({ name: "planningIndex" });
  }

  return {
    handleCreatePlan,
    planErrors,
    planLoading,
  };
}

function useReviewAndAdd() {
  async function handleReviewAndAdd() {
    const isValid = await validate();

    if (isValid.valid) {
      showConfirmationDialog.value = true;
    }
  }

  async function handlePlanReviewConfirmed() {
    /* hide the confirmation dialog */
    showConfirmationDialog.value = false;

    /* submit the form */
    await submit();

    /* clear the form fields */
    handleReset();
  }

  return {
    handleReviewAndAdd,
    handlePlanReviewConfirmed,
  };
}
</script>
<template>
  <div class="container max-w-[50rem]">
    <form
      class="grid gap-4 lg:grid-cols-[minmax(10rem,25rem),1fr]"
      @submit.prevent="submit"
    >
      <FormField v-slot="{ componentField }" name="sku">
        <FormItem>
          <FormLabel>Product</FormLabel>
          <FormDescription
            >Select the product for which you want to create a
            plan.</FormDescription
          >
          <FormControl>
            <FormProductInput v-bind="componentField" />
            <FormMessage />
          </FormControl>
        </FormItem>
      </FormField>
      <div class="grid gap-3 rounded-md">
        <FormField v-slot="{ componentField }" name="plan_data.code">
          <FormItem>
            <FormLabel>Plan code</FormLabel>
            <FormDescription>Code must be unique.</FormDescription>
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
              <Textarea v-bind="componentField" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="plan_data.is_prototype">
          <FormItem>
            <FormLabel>Plan type</FormLabel>
            <FormDescription
              >Choose the appropriate plan to run in production.
            </FormDescription>
            <FormControl>
              <FormProductPlanType v-bind="componentField" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <div class="col-span-full">
        <Label for="batches">Task creation</Label>
        <p class="text-sm text-muted-foreground">
          Create a batch of tasks. You can change the priority of a batch, and
          you can modify the schedule of either the entire batch or each
          individual task.
        </p>

        <div
          class="space-y-4 rounded-md border p-4 text-sm shadow"
          v-if="controlledValues.sku"
        >
          <ButtonApp variant="secondary" @click="handleAddBatch" class="w-fit"
            ><Plus /> Add batch</ButtonApp
          >

          <ul class="space-y-1">
            <li
              v-for="(batch, index) in batchFields"
              :key="batch.key"
              class="flex flex-wrap items-start gap-3 rounded-md border p-2"
            >
              <FormField
                :name="`batches[${index}].qty`"
                v-slot="{ componentField }"
              >
                <FormItem class="shrink">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :name="`batches[${index}].start_date`"
                v-slot="{ componentField }"
              >
                <FormItem class="shrink">
                  <FormLabel>Access Date</FormLabel>

                  <FormControl>
                    <Input type="date" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :name="`batches[${index}].start_operation`"
                v-slot="{ componentField }"
              >
                <FormItem class="grow">
                  <FormLabel>Start route</FormLabel>
                  <template v-if="filteredRoutings && filteredRoutings.length">
                    <FormControl>
                      <FormRoutingSelectInput
                        v-bind="componentField"
                        :routings="filteredRoutings"
                      />
                    </FormControl>
                    <FormMessage />
                  </template>
                  <div
                    v-else
                    class="flex w-fit items-center gap-2 rounded-md border p-2"
                  >
                    <TriangleAlert :size="17" />
                    <p>
                      No Routing available for
                      <span class="font-medium">{{
                        controlledValues.sku
                      }}</span>
                    </p>
                  </div>
                </FormItem>
              </FormField>
              <div class="flex max-w-[50rem] flex-col gap-1">
                <ButtonApp
                  size="icon"
                  variant="ghost"
                  class="h-6 w-6"
                  @click.stop="handleRemoveBatch(index)"
                >
                  <Trash class="stroke-destructive" />
                </ButtonApp>
              </div>
            </li>
          </ul>
        </div>
        <div
          v-else
          class="rounded-md border border-dashed p-4 text-center text-xs"
        >
          <Info :size="15" class="mx-auto" />
          <p>Select a product to start adding tasks.</p>
        </div>
      </div>
      <div class="col-span-full text-end">
        <FormSubmitButton
          :disabled="Object.keys(errors).length"
          @add="submit"
          :loading="planLoading"
        >
          <ButtonApp
            class="px-3 shadow-none"
            :disabled="Object.keys(errors).length || planLoading"
            @click="handleReviewAndAdd"
            :loading="planLoading"
            >Review & Add
          </ButtonApp>
        </FormSubmitButton>
      </div>
    </form>

    <PlanFormReviewDialog
      @yes="handlePlanReviewConfirmed"
      v-if="product?.routings"
      v-model:open="showConfirmationDialog"
      :routings="product.routings"
      :plan-form-values="planFormValues as PlanForm"
    />
  </div>
</template>

<style scoped></style>
