import type { PlanBatch, PlanStatus, PlanStatusCode } from "./planning";
import type { Product, ProductRoutingWorkcenter } from "./products";
import type { Worker } from "./workers";

export interface WipTask {
  task_plan_id: string;
  parent_code: string;
  sku: string;
  task_index: number;
  can_accessed_at: string;
  is_startable: boolean;
  plan_id: string;
  batch_id: string;
  operation_code: string;
  operation_number: string;
  previous_operation: string[];
  next_operation: string[];
  is_autocomplete: boolean;
  routing_no: string;
  manpower: number;
  runtime: number;
  id: string;
  status: TaskStatus;
  workcenter: ProductRoutingWorkcenter;
  workers?: Worker[];
}

export type TaskStatus =
  | "unassigned"
  | "done"
  | "ongoing"
  | "pending"
  | "cancelled"
  | "qc-failed"
  | "paused";

export type WipTaskGrouped = WipPlanProduct & {
  product_data: (WipPlanProduct & {
    parent_code: string;
    plan_data: WipPlan[];
  })[];
};

export type WipPlanProduct = Pick<
  Product,
  "sku" | "title" | "updated_at" | "created_at" | "id"
> & {
  thumbnail: string;
};

export type WipBatch = Omit<
  PlanBatch,
  "tasks" | "user_data" | "plan_id" | "task_qty"
> & {
  batch_id: string;
  tasks?: WipTask[];
};

export interface WipPlan {
  id: string;
  plan_id: string;
  status_code: PlanStatusCode;
  code: string;
  parent_code: string;
  sku: string;
  created_at: string;
  updated_at: string;
  batch_data: WipBatch[];
}

export interface WipPlanQueryParams {
  filter: string;
  work_centers: string[];
}

export interface WipTaskQueryParams {
  filter: PlanStatusCode;
  keyword: string;
  pages: number;
  is_accessible: boolean;
  // "keyword": "2505-0005"
}
