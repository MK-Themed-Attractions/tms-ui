import type { DataTableColumns } from "@/components/app/data-table";

export const customLabelColumns: DataTableColumns[] = [
  { key: "id", title: "ID" },
  { key: "title", title: "Title" },
  {
    key: "actions",
    title: "",
  },
];

export const customLabelDataColumns: DataTableColumns[] = [
  { key: "id", title: "Reference Code" },
  { key: "sku", title: "Product Code" },
  { key: "client_code", title: "Client Code" },
  { key: "client_title", title: "Client Title" },
  {
    key: "actions",
    title: "",
  },
];
