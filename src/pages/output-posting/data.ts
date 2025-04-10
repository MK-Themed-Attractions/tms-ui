import type { DataTableColumns } from "@/components/app/data-table";

export const outputPostingDataTableColumns: DataTableColumns[] = [
  {
    key: "check",
    title: "",
  },
  {
    key: "plan_code",
    title: "Plan code",
  },
  {
    key: "sku",
    title: "Product SKU",
  },
  {
    key: "operation_code",
    title: "Routing",
  },
  {
    key: "plan_task_id",
    title: "Task UUIDs",
  },
];
