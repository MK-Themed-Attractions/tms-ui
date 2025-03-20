<script setup lang="ts">
import { ButtonApp } from "@/components/app/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
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
import { useWorkerDepartmentStore } from "@/stores/workerDepartmentStore";
import type { WorkerDepartment, WorkerDepartmentForm } from "@/types/workers";
import { toTypedSchema } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import { useFieldArray, useForm } from "vee-validate";
import * as z from "zod";
import { toast } from "vue-sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-vue-next";
import { computed, inject, onUpdated } from "vue";
import { workerDepartmentOnSuccessKey } from "@/lib/injectionKeys";
import type { ProductRoutingWorkcenter } from "@/types/products";
import WorkCenterInput from "./WorkCenterInput.vue";
import { useProductStore } from "@/stores/productStore";

const props = defineProps<{
  workerDepartment?: WorkerDepartment;
}>();
const formSchema = toTypedSchema(
  z.object({
    code: z.string().max(50).min(1),
    name: z.string().max(255).min(1),
    description: z.string().optional(),
    work_centers: z.array(z.string()).nonempty("Required"),
    ms_url: z.string().nonempty('Required')
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

const { createDepartment, loading, errors, updateDepartment } =
  useWorkerDepartment();
const {
  fetchWorkCenters,
  workCenters,
  handleWorkcenterSelect,
  selectedWorkCenters,
} = useWorkCenter();

const dialog = defineModel({ default: false });
const onSuccess = inject(workerDepartmentOnSuccessKey, null);

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

function useWorkCenter() {
  const productStore = useProductStore();
  const { workCenters } = storeToRefs(productStore);
  const {
    fields: selectedWorkCenters,
    push,
    remove,
  } = useFieldArray<string>("work_centers");

  async function fetchWorkCenters() {
    await productStore.getWorkCenters();
  }

  function handleWorkcenterSelect(workCenter: ProductRoutingWorkcenter) {
    const wcIndex = selectedWorkCenters.value.findIndex(
      (wc) => wc.value === workCenter.no,
    );

    if (wcIndex !== -1) {
      /* remove from list if existed */
      remove(wcIndex);
    } else {
      /* add to list */
      push(workCenter.no);
    }
  }

  return {
    workCenters,
    fetchWorkCenters,
    selectedWorkCenters,
    handleWorkcenterSelect,
  };
}

/* computed properties */
const isUpdating = computed(() => (props.workerDepartment ? true : false));

onUpdated(async () => {
  if (props.workerDepartment) {
    setFieldValue("code", props.workerDepartment.code);
    setFieldValue("description", props.workerDepartment.description);
    setFieldValue("name", props.workerDepartment.name);

    setFieldValue(
      "work_centers",
      props.workerDepartment.work_centers as [string, ...string[]],
    );
  }

  /* Initialize work centers */
  if (!workCenters.value) {
    await fetchWorkCenters();
  }
});
</script>
<template>
  <Dialog v-model:open="dialog">
    <slot :props="{
      onClick: () => {
        dialog = true;
      },
    }">
    </slot>

    <DialogScrollContent @pointer-down-outside="(e) => e.preventDefault()" class="max-w-[30rem]">
      <!-- HEADER -->
      <DialogHeader>
        <slot name="header.title">
          <DialogTitle>Add Department</DialogTitle>
        </slot>
        <slot name="header.description">
          <DialogDescription>Add new department, Click save when your're
            done.</DialogDescription>
        </slot>
      </DialogHeader>

      <!-- CONTENT -->
      <div>
        <Alert variant="destructive" v-if="errors && errors.status === 422">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>An error occured!</AlertTitle>
          <AlertDescription>{{ errors.data.data[0] }}</AlertDescription>
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
          <FormField v-slot="{ componentField }" name="work_centers">
            <FormItem class="grid grid-cols-4 items-center gap-x-4">
              <FormLabel>Work Centers</FormLabel>

              <FormControl>
                <WorkCenterInput v-if="workCenters && workCenters.length" v-model="selectedWorkCenters"
                  :work-centers="workCenters" @select="handleWorkcenterSelect" />
              </FormControl>
              <div class="col-start-2 -col-end-1">
                <FormDescription>Select at least 1 work center</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="ms_url">
            <FormItem class="">
              <FormLabel class="text-right">Microservice .ENV key</FormLabel>
              <FormControl>
                <Input type="text" class="col-span-3" v-bind="componentField" />
              </FormControl>
              <FormDescription>Point this department to your microservice URL Key. This will determine which routing
                microservice this department should go.
              </FormDescription>
            </FormItem>
          </FormField>

          <DialogFooter>
            <ButtonApp type="submit" :loading="loading">Save</ButtonApp>
          </DialogFooter>
        </form>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
