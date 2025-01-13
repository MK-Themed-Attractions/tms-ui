import type { DataTableColumns } from "@/components/app/data-table";

export const displayColumns: DataTableColumns[] = [
  { key: "check", title: "" },
  { key: "worker_number", title: "Worker Id" },
  { key: "full_name", title: "Full name" },
  { key: "department.name", title: "Department" },
  { key: "rfid_card", title: "RFID" },
  { key: "actions", title: "" },
];
