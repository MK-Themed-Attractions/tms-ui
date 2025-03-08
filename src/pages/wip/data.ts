import type { DataTableColumns } from "@/components/app/data-table";
import type { InputFilterDropdownData } from "@/components/app/input-filter";

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
