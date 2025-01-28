<script setup lang="ts">
import type { Plan } from "@/types/planning";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const props = defineProps<{
  plan?: Plan;
}>();

const formSchema = toTypedSchema(
  z.object({
    sku: z.string().nonempty(),
    plan_data: z.object({
      code: z.string(),
      description: z.string().optional(),
    }),
  }),
);
</script>
<template>
  <form></form>
</template>

<style scoped></style>
