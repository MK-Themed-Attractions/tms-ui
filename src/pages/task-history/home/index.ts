import type { InputFilterDropdownData } from "@/components/app/input-filter";
import type { TaskHistoryParams } from "@/types/taskHistory";

export const inputFilterData: (Omit<InputFilterDropdownData, "key"> & {
  key: keyof TaskHistoryParams;
})[] = [
  { key: "task_id", value: "Task UUID" },
  { key: "sku", value: "Product SKU" },
  { key: "plan_code", value: "Plan Code" },
  { key: "batch_id", value: "Batch UUID" },
];
