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
import type { WorkerDepartment, WorkerDepartmentForm } from "@/types/workers";
import { toTypedSchema } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import * as z from "zod";
import { toast } from "vue-sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-vue-next";
import { computed, inject, onUpdated } from "vue";
import { workerDepartmentOnSuccessKey } from "@/lib/injectionKeys";

const props = defineProps<{
  workerDepartment?: WorkerDepartment;
}>();
const { createDepartment, loading, errors, updateDepartment } =
  useWorkerDepartment();
const dialog = defineModel({ default: false });
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
  setFieldValue,
} = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  if (isUpdating.value) {
    await updateDepartment(values);
  } else await createDepartment(values);

  /**
   * display a success toaster when response in OK
   */
  if (!errors.value) {
    toast("Success", {
      description: !isUpdating.value
        ? "A new department has been added."
        : "Department has been updated.",
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

  async function updateDepartment(form: WorkerDepartmentForm) {
    if (props.workerDepartment)
      await workerDepartmentStore.updateDepartment(
        props.workerDepartment?.id,
        form,
      );
  }

  return {
    loading,
    errors,
    createDepartment,
    updateDepartment,
  };
}

/* computed properties */
const isUpdating = computed(() => (props.workerDepartment ? true : false));

onUpdated(() => {
  if (props.workerDepartment) {
    setFieldValue("code", props.workerDepartment.code);
    setFieldValue("description", props.workerDepartment.description);
    setFieldValue("name", props.workerDepartment.name);
  }
});
</script>
<template>
  <Dialog v-model:open="dialog">
    <slot
      :props="{
        onClick: () => {
          dialog = true;
        },
      }"
    >
    </slot>

    <DialogContent
      @pointer-down-outside="(e) => e.preventDefault()"
      class="max-w-[30rem]"
    >
      <!-- HEADER -->
      <DialogHeader>
        <slot name="header.title">
          <DialogTitle>Add Department</DialogTitle>
        </slot>
        <slot name="header.description">
          <DialogDescription
            >Add new department, Click save when your're
            done.</DialogDescription
          >
        </slot>
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
