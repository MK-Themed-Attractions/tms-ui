import type { DataTableColumns } from "@/components/app/data-table";
import type { WipBatch, WipPlan, WipTask } from "@/types/wip";
import type { ComputedRef, InjectionKey } from "vue";

export const inventorySelectedKey = Symbol() as InjectionKey<
  ComputedRef<{
    batch: WipBatch | undefined;
    plan: WipPlan | undefined;
    tasks: WipTask[] | undefined;
    route: string | undefined;
  }>
>;
export const fetchBomKey = Symbol() as InjectionKey<
  (batch: WipBatch) => Promise<void>
>;

export type AllocationMode = "add" | "edit";
export const inventoryTaskDataTableColumns: DataTableColumns[] = [
  {
    key: "workcenter.name",
    title: "Work Center Code",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "can_access_at",
    title: "Access Date",
  },
  {
    key: "allocate_bom",
    title: "Bom Allocated",
  },
  {
    key: "actions",
    title: "",
  },
];
