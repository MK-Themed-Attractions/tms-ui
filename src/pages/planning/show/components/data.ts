import type { DataTableColumns } from "@/components/app/data-table";

export const taskColumns: DataTableColumns[] = [
  { key: "current_operation_data.workcenters.name", title: "Current routing" },
  { key: "status_code", title: "Status" },
  { key: "start_date", title: "Access date" },
  { key: "current_operation_data.runtime", title: "Runtime" },
  { key: "current_operation_data.manpower", title: "Required manpower" },
  { key: "actions", title: "" },
];
