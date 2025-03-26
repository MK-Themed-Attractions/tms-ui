import type { DataTableColumns } from "@/components/app/data-table";

export const displayColumns: DataTableColumns[] = [
  {
    key: "code",
    title: "Code",
  },
  {
    key: "name",
    title: "Name",
  },
  {
    key: "description",
    title: "Description",
  },
  {
    key: "work_centers",
    title: "Work centers",
  },
  {
    key: "ms_url",
    title: "Pointing to MS",
  },
  {
    key: "actions",
    title: "",
  },
];
