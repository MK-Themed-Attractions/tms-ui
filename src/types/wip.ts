import type { Plan, PlanBatch } from "./planning";
import type { Product, ProductRoutingWorkcenter } from "./products";

export interface WipTask {
  plan: Pick<Plan["plan_data"], "code"> & Pick<Plan, "id" | "status_code">;
  product: Pick<Product, "sku" | "title"> & {
    thumbnail: string;
  };
  batch: Pick<PlanBatch, "start_date" | "id" | "batch_index" | "status_code">;
  can_access_at: string;
  id: string;
  is_startable: boolean;
  parent_sku: string;
  parent_thumbnail: string;
  status: "unassigned";
  task_index: number;
}

export interface WipTaskGrouped {
  [parentSku: string]: {
    [sku: string]: {
      [planId: string]: {
        [batchId: string]: WipTask[]
      };
    };
  };
}

export interface WipTaskQueryParams {
  filter: string;
  work_centers: string[];
}
