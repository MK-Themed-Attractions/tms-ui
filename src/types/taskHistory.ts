import type { User } from "./auth";
import type { TimeStamp } from "./general";
import type { BatchTask, PlanBatch, PlanData } from "./planning";
import type {
  Product,
  ProductRouting,
  ProductRoutingWorkcenter,
  ProductRoutingWorkCenterType,
} from "./products";

export interface TaskHistory extends TimeStamp {
  plan_data: PlanData;
  id: string;
  user_data: User;
  product_data: Product;
  batches: TaskHistoryBatch[];
}

export type TaskHistoryBatch = Omit<PlanBatch, "tasks"> & {
  tasks: TaskHistoryTask[];
};

export type TaskHistoryTask = BatchTask & {
  histories: History[];
};
export interface History {
  task_id: string;
  id: string;
  operation_data: Pick<
    ProductRouting,
    "operation_code" | "operation_number" | "manpower" | "runtime"
  >;
  work_centers: Pick<ProductRoutingWorkcenter, "no" | "name">;
  contents: HistoryContent[];
}

export interface HistoryContent extends Pick<TimeStamp, "created_at"> {
  type: HistoryContentType;
  message: string;
}

export type HistoryContentType =
  | "created"
  | "assigned"
  | "unassigned"
  | "started"
  | "paused"
  | "finished"
  | "cancelled"
  | "override"
  | "qc-passed"
  | "qc-failed";

export interface TaskHistoryParams {
  plan_id: string;
  batch_id: string;
  task_id: string;
  sku: string;
  title: string;
  operation_number: string;
  operation_code: string;
  workcenters_code: string;
  workcenters_name: ProductRoutingWorkCenterType;
  plan_code: string;
}
