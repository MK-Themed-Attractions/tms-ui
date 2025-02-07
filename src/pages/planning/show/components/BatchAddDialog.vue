<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/stores/productStore";
import { toTypedSchema } from "@vee-validate/zod";
import { ArrowBigRight, Plus, Trash } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useFieldArray, useForm } from "vee-validate";
import { onMounted, watchEffect } from "vue";
import { z } from "zod";
import FormRoutingSelectInput from "../../create/components/FormRoutingSelectInput.vue";
import { usePlanStore } from "@/stores/planStore";
import type { Plan } from "@/types/planning";
import { toast } from "vue-sonner";

const props = defineProps<{
  plan: Plan;
}>();
const dialog = defineModel({ default: false });

const formSchema = toTypedSchema(
  z.object({
    batches: z.array(
      z.object({
        qty: z.number().int().positive(),
        start_date: z.coerce.date(),
        start_operation: z.string().nonempty("Required"),
      }),
    ),
  }),
);

const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
});
const productStore = useProductStore();
const { product } = storeToRefs(productStore);
const { batches, handleAddBatch, handleRemoveBatch } = useBatch();
const planStore = usePlanStore();
const { loading: planLoading, errors: planErrors } = storeToRefs(planStore);

const submit = handleSubmit(async (values) => {
  await planStore.appendBatch(props.plan.id, values);
  await planStore.getPlans();
  if (!planErrors.value) {
    toast("Processing", {
      description:
        "The batch is being processed. We will notify you once it is complete.",
    });
    dialog.value = false;
  }
});

function useBatch() {
  const { fields: batches, push, remove } = useFieldArray("batches");

  function handleAddBatch() {
    push({
      qty: 1,
      start_date: new Date(Date.now()).toISOString().split("T")[0],
      start_operation: "",
    });
  }

  function handleRemoveBatch(index: number) {
    remove(index);
  }

  return {
    batches,
    handleAddBatch,
    handleRemoveBatch,
  };
}

watchEffect(async () => {
  await productStore.getProduct(props.plan.product_data.sku, {
    includes: "routings",
  });
});
</script>

<template>
  <Dialog v-model:open="dialog">
    <DialogScrollContent
      @interact-outside="(e) => e.preventDefault()"
      class="max-w-[40rem]"
    >
      <DialogHeader>
        <DialogTitle>Add Batch</DialogTitle>
        <DialogDescription
          >Add new batch to this plan. Please review before proceeding as this
          batch will not be deleted once added.
        </DialogDescription>

        <form @submit.prevent="submit" class="mt-4 space-y-4">
          <ButtonApp
            :prepend-icon="Plus"
            variant="secondary"
            @click="handleAddBatch"
          >
            Add batch</ButtonApp
          >
          <ul class="space-y-2">
            <li
              v-for="(batch, index) in batches"
              :key="batch.key"
              class="relative flex flex-wrap gap-2 rounded-md border p-2 shadow"
            >
              <FormField
                #default="{ componentField }"
                :name="`batches[${index}].qty`"
              >
                <FormItem>
                  <FormLabel>Qty</FormLabel>
                  <FormControl>
                    <Input type="number" v-bind="componentField" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                #default="{ componentField }"
                :name="`batches[${index}].start_date`"
              >
                <FormItem>
                  <FormLabel>Access date</FormLabel>
                  <FormControl>
                    <Input type="date" v-bind="componentField" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                #default="{ componentField }"
                :name="`batches[${index}].start_operation`"
              >
                <FormItem class="flex-1">
                  <FormLabel>Start route</FormLabel>
                  <FormControl>
                    <FormRoutingSelectInput
                      v-if="product?.routings"
                      :routings="product?.routings"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <div class="absolute right-1 top-1">
                <ButtonApp
                  size="icon"
                  class="h-6 w-6 text-destructive"
                  variant="ghost"
                  @click="handleRemoveBatch(index)"
                >
                  <Trash />
                </ButtonApp>
              </div>
            </li>
          </ul>
          <div class="flex justify-end">
            <ButtonApp type="submit" :prepend-icon="Plus" :loading="planLoading"
              >Append batch</ButtonApp
            >
          </div>
        </form>
      </DialogHeader>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
