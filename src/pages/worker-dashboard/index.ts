export type RFIDScannerEvent = (rfid: string) => void;

export type RFIDState = "detected" | "scanning" | "not-detected";

export type TaskOperationType = "start" | "pause" | "done";

export interface WorkerStats {
    tasksCount: number;
    points: number;
}