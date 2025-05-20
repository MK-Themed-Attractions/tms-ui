import type { DataTableColumns } from "@/components/app/data-table";

export type RFIDScannerEvent = (rfid: string) => void;

export type RFIDState = "detected" | "scanning" | "not-detected";

export type TaskOperationType = "start" | "pause" | "done" | 'print';

export interface WorkerStats {
  tasksCount: number;
  points: number;
}

export const taskDataTableColumns: DataTableColumns[] = [
  {
    key: "operation_code",
    title: "Current Route",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "is_startable",
    title: "Availability",
  },
  {
    key: "actions",
    title: "",
  },
];
