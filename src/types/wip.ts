import type { ProductRoutingWorkcenter } from "./products";

export interface WipTask {
  task_plan_id: string;
  task_index: number;
  sku: string;
  parent_code: string;
  operation_code: string;
  operation_number: string;
  previous_operation: string[];
  next_operation: string[];
  is_autocomplete: false;
  routing_no: string;
  manpower: number;
  runtime: number;
  workcenters: ProductRoutingWorkcenter;
  can_accessed_at: string;
  is_startable: boolean;
  plan_data: {
    code: string;
    is_prototype: boolean;
  };
  plan_id: string;
  batch_id: string;
  id: string;
  status: string;
}

export interface WipTaskGrouped {
  [key: string]: WipTask[];
}

export interface WipTaskQueryParams {
  filter: string;
  work_centers: string[];
}
