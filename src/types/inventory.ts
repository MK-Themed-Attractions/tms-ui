import type { ProductRoutingBOM } from "./products";

export type InventoryPayload = {
  production_bom_no: string;
  no: string;
  quantity: number;
  plan_task_id: string;
  plan_code: string;
};

export type InventoryQueryParams = {
  plan_task_ids: string[];
};

export type InventoryAllocatedBom = ProductRoutingBOM & {
  plan_task_id: string;
  plan_code: string;
};
