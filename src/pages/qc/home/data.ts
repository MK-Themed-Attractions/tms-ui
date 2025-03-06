import type { DataTableColumns } from "@/components/app/data-table";

export const qcTaskDataTableColumn: DataTableColumns[] = [
  { key: "task_index", title: "Sequence" },
  { key: "status", title: "Status" },
  { key: "qc_passed_at", title: "Passed at" },
  { key: "qc_failed_at", title: "Already failed at" },
  { key: "actions", title: "" },
];

export type QCTaskVerdict = "pass" | "fail";
