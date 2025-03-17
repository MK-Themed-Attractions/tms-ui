import type { DataTableColumns } from "@/components/app/data-table";

export const permissionDataTableColumns: DataTableColumns[] = [
  {
    key: "name",
    title: "Key",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "id",
    title: "UUID",
  },
  {
    key: "actions",
    title: "",
  },
];
