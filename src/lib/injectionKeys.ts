import type { WorkerQueryParams } from "@/types/workers";
import type { InjectionKey } from "vue";

export const workerDepartmentOnSuccessKey = Symbol() as InjectionKey<
  (params?: Partial<WorkerQueryParams>) => Promise<void>
>;

export const workerOnSuccessKey = Symbol() as InjectionKey<
  (params?: Partial<WorkerQueryParams>) => Promise<void>
>;
