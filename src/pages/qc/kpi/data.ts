import type { DataTableColumns } from "@/components/app/data-table";

export const kpiDataTableColumns: DataTableColumns[] = [
  {
    key: "title",
    title: "Title",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "is_default",
    title: "Default to all",
  },
  {
    key: "departments",
    title: "Work Centers",
  },
  {
    key: "actions",
    title: "",
  },
];

export const kpiDeptDataTableColumns: DataTableColumns[] = [
  {
    key: "title",
    title: "Title",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "actions",
    title: "",
  },
];
