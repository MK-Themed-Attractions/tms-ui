import type { Awaitable } from "@vueuse/core";
import type { InjectionKey } from "vue";

export const workerDepartmentOnSuccessKey = Symbol() as InjectionKey<
  () => Promise<void>
>;
