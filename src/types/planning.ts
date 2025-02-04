import type { QueryParams } from "./auth";
import type { ProductRoutingOperationLetter } from "./products";

export interface Plan {
  sku: string;
  sku_title: string;
  routing_link_code: string;
  plan_code: string;
  plan_description: string;
  user_id: string;
  updated_at: string;
  created_at: string;
  id: string;
  status: PlanStatusCode;
  user_data?: PlanUserData;
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
export interface PlanUserData {
  full_name: string;
  id: string;
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
