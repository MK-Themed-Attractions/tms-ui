import type { DataTableColumns } from "@/components/app/data-table";
import { PlanStatusCode } from "@/types/planning";

export const planStatuses = [
  { id: "1", name: PlanStatusCode[0] },
  { id: "2", name: PlanStatusCode[1] },
  { id: "3", name: PlanStatusCode[3] },
  { id: "4", name: PlanStatusCode[4] },
];

export const planDataColumns: DataTableColumns[] = [
  { key: "plan_code", title: "Plan code" },
  { key: "status_code.status", title: "Status" },
  { key: "sku", title: "Item code" },
  { key: "sku_title", title: "Item description" },
  { key: "updated_at", title: "Last modified date" },
  { key: "user_data.full_name", title: "Last modified by" },
];
