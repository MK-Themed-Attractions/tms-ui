import type { DateValues } from "date-fns";
import type { QueryParams, TimeStamp } from "./general";
import type { ProductRoutingWorkCenterType } from "./products";
import type { DateValue } from "reka-ui";

export interface OutputPosting extends TimeStamp {
  id: string;
  batch_id: string;
  is_approved: boolean;
  operation_code: ProductRoutingWorkCenterType;
  operation_number: string;
  plan_code: string;
  plan_id: string;
  plan_task_id: string[];
  runtime: number;
  sku: string;
  is_finished: false;
}

export interface OutputPostingQueryParams
  extends Omit<QueryParams, "per_page"> {
  pages: string | number;
  operation_code: string[];
  startDate: DateValue;
  endDate: DateValue;
  is_approved: boolean;
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
