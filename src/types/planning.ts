import type { QueryParams, User } from "./auth";
import type { Product, ProductRoutingOperationLetter } from "./products";

export interface Plan {
  plan_data: {
    code: string;
    is_prototype: boolean;
    description: string;
  };
  product_data: Product;
  updated_at: string;
  created_at: string;
  id: string;
  status_code: PlanStatusCode;
  user_data?: User;
  batches?: PlanBatch[];
}
export interface PlanBatch {
  batch_index: number;
  created_at: string;
  id: string;
  plan_id: string;
  start_date: string;
  status_code: PlanStatusCode;
  task_qty: number;
  updated_at: string;
  user_data?: User;
}

export interface PlanStatus {
  code: string;
  status: PlanStatusCode;
  description: string;
}
export enum PlanStatusCode {
  INITIALIZED,
  STARTED,
  CANCELED,
  ARCHIVED,
  PROTOTYPE,
  PENDING,
}

export interface PlanForm {
  sku: string;
  plan_data: {
    code: string;
    description?: string;
    is_prototype: boolean;
  };

  batches: {
    qty: number;
    start_date: Date;
    start_operation: ProductRoutingOperationLetter;
  }[];
}

export interface PlanQueryParams extends QueryParams {}
