import type { WipBatch } from "@/types/wip";
import type { WorkerQueryParams } from "@/types/workers";
import type { InjectionKey } from "vue";

export const workerDepartmentOnSuccessKey = Symbol() as InjectionKey<
  (params?: Partial<WorkerQueryParams>) => Promise<void>
>;

export const workerOnSuccessKey = Symbol() as InjectionKey<
  (params?: Partial<WorkerQueryParams>) => Promise<void>
>;

export const batchWipSuccessKey = Symbol() as InjectionKey<
  (batch: WipBatch) => Promise<void>
>;

export const mainScrollerKey = Symbol() as InjectionKey<
  () => {
    getScrollY: () => number;
    scrollMainTo: (yScroll: number) => void;
  }
>;
