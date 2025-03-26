import type { DataTableColumns } from "@/components/app/data-table";
import type { InputFilterDropdownData } from "@/components/app/input-filter";
export type QCTaskVerdict = "pass" | "fail";

export const qcTaskDataTableColumn: DataTableColumns[] = [
  { key: "operation_code", title: "Work center" },
  { key: "status", title: "Status" },
  { key: "qc_passed_at", title: "Passed at" },
  { key: "qc_failed_at", title: "Already failed at" },
  { key: "actions", title: "" },
];

export const searchFilterData: InputFilterDropdownData[] = [
  { key: "product-sku", value: "Product SKU" },
  { key: "plan-code", value: "Plan code" },
];
