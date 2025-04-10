import type { QueryParams, TimeStamp } from "./general";
import type { ProductRoutingWorkCenterType } from "./products";

export interface OutputPosting extends TimeStamp {
  id: string;
  batch_id: string;
  is_approved: boolean;
  operation_code: ProductRoutingWorkCenterType;
  plan_code: string;
  plan_id: string;
  plan_task_id: string[];
  runtime: number;
  sku: string;
}

export interface OutputPostingQueryParams
  extends Omit<QueryParams, "per_page"> {
  pages: string | number;
}

/**
 * Represents a form containing an array of task IDs.
 */
export interface OutputPostingForm {
  /**
   * Array of task IDs to be posted.
   */
  posting_ids: string[];
}
