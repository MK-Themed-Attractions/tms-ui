import type { QueryParams } from "./auth";

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
  status_code: PlanStatus;
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
}
export interface PlanUserData {
  full_name: string;
  id: string;
}

export interface PlanQueryParams extends QueryParams {}
