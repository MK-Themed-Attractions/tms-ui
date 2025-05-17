import type { DataTableColumns } from "@/components/app/data-table";
import type { InputFilterDropdownData } from "@/components/app/input-filter";
import type { WorkerDepartment } from "@/types/workers";
import type { DateValue } from "reka-ui";
import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from "vue";

export const wipWorkerDataTableColumns: DataTableColumns[] = [
  {
    key: "select",
    title: "",
  },
  {
    key: "worker_number",
    title: "Worker Id",
  },
  {
    key: "full_name",
    title: "Name",
  },
  {
    key: "department.name",
    title: "Department",
  },
];

export const searchFilterData: InputFilterDropdownData[] = [
  { key: "product-sku", value: "Product SKU" },
  { key: "plan-code", value: "Plan code" },
];

export const workerPerPage = 10;

export const workCentersKey = Symbol() as InjectionKey<
  ComputedRef<string[] | undefined>
>;

export const selectedDepartmentKey = Symbol() as InjectionKey<
  ComputedRef<WorkerDepartment | undefined>
>;

export type WipDateFilterType =
  | "today"
  | "yesterday"
  | "this-week"
  | "last-week"
  | "this-month"
  | "last-month"
  | "custom";
export type SelectedDateRange = {
  start: DateValue;
  end: DateValue;
};
