<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import type { WorkerDepartmentForm } from "@/types/workers";
import { toTypedSchema } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import * as z from "zod";
import { toast } from "vue-sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-vue-next";
import { inject, ref } from "vue";
import { workerDepartmentOnSuccessKey } from "@/lib/injectionKeys";

const { createDepartment, loading, errors } = useWorkerDepartment();
const dialog = ref(false);
const onSuccess = inject(workerDepartmentOnSuccessKey, null);
const formSchema = toTypedSchema(
  z.object({
    code: z.string().max(50).min(1),
    name: z.string().max(255).min(1),
    description: z.string().optional(),
  }),
);

const {
  handleSubmit,
  resetForm,
  errors: validationError,
} = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  await createDepartment(values);

  /**
   * display a success toaster when response in OK
   */
  if (!errors.value) {
    toast("Success", {
      description: "A new department has been added.",
    });

    /**
     * clear the form after validating
     */
    resetForm();

    /**
     * refetch the departments
     * to update the department list
     */
    if (onSuccess) await onSuccess();

    /**
     * close the dialog after successful operation
     */
    dialog.value = false;
  }
});

function useWorkerDepartment() {
  const workerDepartmentStore = useWorkerDepartmentStore();
  const { loading, errors } = storeToRefs(workerDepartmentStore);

  async function createDepartment(form: WorkerDepartmentForm) {
    await workerDepartmentStore.createDepartment(form);
  }

  return {
    loading,
    errors,
    createDepartment,
  };
}
</script>
<template>
  <Dialog v-model:open="dialog">
    <ButtonApp :prepend-icon="Plus" @click="dialog = true">Add</ButtonApp>

    <DialogContent
      @pointer-down-outside="(e) => e.preventDefault()"
      class="max-w-[30rem]"
    >
      <!-- HEADER -->
      <DialogHeader>
        <DialogTitle>Add Department</DialogTitle>
        <DialogDescription
          >Add new department, Click save when your're done.</DialogDescription
        >
      </DialogHeader>

      <!-- CONTENT -->
      <div>
        <Alert variant="destructive" v-if="errors">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>An error occured!</AlertTitle>
          <AlertDescription>{{ errors?.data.data[0] }}</AlertDescription>
        </Alert>
        <form class="grid gap-4 py-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="code">
            <FormItem class="grid grid-cols-4 items-baseline gap-x-4">
              <FormLabel class="text-right">Code</FormLabel>
              <FormControl>
                <Input type="text" class="col-span-3" v-bind="componentField" />
                <FormMessage class="col-span-3 col-start-2" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="grid grid-cols-4 items-baseline gap-x-4">
              <FormLabel class="text-right">Name</FormLabel>
              <FormControl>
                <Input type="text" class="col-span-3" v-bind="componentField" />
                <FormMessage class="col-span-3 col-start-2" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem class="grid grid-cols-4 items-baseline gap-4">
              <FormLabel class="text-right">Description</FormLabel>
              <FormControl>
                <Input type="text" class="col-span-3" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>

          <DialogFooter>
            <ButtonApp type="submit" :loading="loading">Save</ButtonApp>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
