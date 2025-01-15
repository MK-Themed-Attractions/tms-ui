<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Worker, WorkerForm } from "@/types/workers";
import { toTypedSchema } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import * as z from "zod";
import { toast } from "vue-sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, ScanQrCode } from "lucide-vue-next";
import { inject, onUpdated, ref, watch } from "vue";
import { workerOnSuccessKey } from "@/lib/injectionKeys";
import { useWorkerStore } from "@/stores/workerStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";

const props = defineProps<{
  worker?: Worker;
}>();
const dialog = defineModel({ default: false });

const { createWorker, loading, errors, updateWorker } = useWorker();
const { departments } = useWorkerDepartment();
const onSuccess = inject(workerOnSuccessKey, null);
const formSchema = toTypedSchema(
  z.object({
    worker_number: z.string().max(255).nonempty("Input must not be empty"),
    given_name: z.string().max(255).nonempty("Input must not be empty"),
    last_name: z.string().max(255).nonempty("Input must not be empty"),
    rfid_card: z.string().max(50).nonempty("Input must not be empty"),
    department_id: z.string().max(255),
  }),
);

const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  if (!isUpdating()) await createWorker(values);
  else await updateWorker(values);

  /**
   * display a success toaster when response in OK
   */
  if (!errors.value) {
    toast("Success", {
      description: isUpdating()
        ? "Worker has been updated."
        : "A new worker has been added.",
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

function useWorker() {
  const workerStore = useWorkerStore();
  const { loading, errors } = storeToRefs(workerStore);

  async function createWorker(form: WorkerForm) {
    await workerStore.createWorker(form);
  }

  async function updateWorker(form: WorkerForm) {
    if (props.worker) await workerStore.updateWorker(props.worker?.id, form);
  }

  return {
    loading,
    errors,
    createWorker,
    updateWorker,
  };
}

function useWorkerDepartment() {
  const workerDepartmentStore = useWorkerDepartmentStore();
  const { departments } = storeToRefs(workerDepartmentStore);

  async function fetchWorkerDepartments() {
    if (!departments.value) await workerDepartmentStore.getDepartments();
  }

  return {
    fetchWorkerDepartments,
    departments,
  };
}

function isUpdating() {
  /**
   * if worker props is available
   * you are assumed to be UPDATING the worker
   */
  return !props.worker ? false : true;
}

/* INIT */

onUpdated(() => {
  if (isUpdating()) {
    setFieldValue("department_id", props.worker?.department?.id);
    setFieldValue("given_name", props.worker?.given_name);
    setFieldValue("last_name", props.worker?.last_name);
    setFieldValue("rfid_card", props.worker?.rfid_card);
    setFieldValue("worker_number", props.worker?.worker_number);
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

    <DialogContent @pointer-down-outside="(e) => e.preventDefault()">
      <DialogHeader>
        <slot name="header.title">
          <DialogTitle>Add Worker</DialogTitle>
        </slot>
        <DialogDescription
          >Fill the form below correct data, Click save when your're
          done.</DialogDescription
        >
      </DialogHeader>
      <!-- HEADER -->

      <!-- CONTENT -->
      <div>
        <Alert variant="destructive" v-if="errors">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>An error occured!</AlertTitle>
          <AlertDescription>{{ errors?.data.data[0] }}</AlertDescription>
        </Alert>

        <form class="grid gap-4 lg:grid-cols-2" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="worker_number">
            <FormItem class="">
              <FormLabel>Employee number</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="rfid_card">
            <FormItem class="">
              <FormLabel>RFID</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
                <FormMessage />
              </FormControl>

              <FormDescription class="flex items-center gap-2"
                ><ScanQrCode :size="15" /> Place the ID on the scanner
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="given_name">
            <FormItem class="">
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="last_name">
            <FormItem class="">
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="department_id">
            <FormItem class="">
              <FormLabel>Department</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department"></SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="dept in departments"
                      :key="dept.id"
                      :value="dept.id"
                    >
                      {{ dept.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <DialogFooter class="col-span-full">
            <ButtonApp type="submit" :loading="loading">Save</ButtonApp>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
