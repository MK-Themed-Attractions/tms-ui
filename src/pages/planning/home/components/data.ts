import type { DataTableColumns } from "@/components/app/data-table";

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
