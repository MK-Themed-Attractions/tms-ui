import type { ProductRoutingBOM } from "./products";

export type InventoryPayload = {
  consumptions: {
    production_bom_no: string;
    no: string;
    quantity: number;
    plan_task_id?: string;
    plan_code?: string;
    task_id?: string;
    id?: string;
    type: InventoryConsumptionType;
  }[];
};

export const inventoryConsumptionType = ["original", "additional"] as const;
export type InventoryConsumptionType =
  (typeof inventoryConsumptionType)[number];
export type InventoryQueryParams = {
  plan_task_ids: string[];
};

export type InventoryAllocatedBom = ProductRoutingBOM & {
  id: string;
  plan_task_id: string;
  plan_code: string;
  task_id: string;
  quantity: number;
  type: InventoryConsumptionType
};
