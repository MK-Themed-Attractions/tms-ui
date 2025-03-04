import type { DataTableColumns } from "@/components/app/data-table";

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

export const workerPerPage = 10;
