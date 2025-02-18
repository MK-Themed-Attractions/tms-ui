import type { DataTableColumns } from "@/components/app/data-table";
import { PlanStatusCode } from "@/types/planning";

export const planStatuses = [
  { id: "1", name: PlanStatusCode[0] },
  { id: "2", name: PlanStatusCode[1] },
  { id: "3", name: PlanStatusCode[3] },
  { id: "4", name: PlanStatusCode[4] },
];

export const planDataColumns: DataTableColumns[] = [
  { key: "plan_data.code", title: "Plan code" },
  { key: "status_code", title: "Status" },
  { key: "plan_data.is_prototype", title: "Plan type" },
  { key: "product_data.sku", title: "Item code" },
  { key: "product_data.title", title: "Item description" },
  { key: "updated_at", title: "Last modified date" },
  {
    key: "actions",
    title: "",
  },
];
