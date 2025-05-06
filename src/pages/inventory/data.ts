import type { DataTableColumns } from "@/components/app/data-table";
import type { WipBatch, WipPlan } from "@/types/wip";
import type { ComputedRef, InjectionKey } from "vue";

export const selectedRoutingKey = Symbol() as InjectionKey<
  ComputedRef<string | undefined>
>;

export const wipBatchKey = Symbol() as InjectionKey<
  ComputedRef<WipBatch | undefined>
>;

export const wipPlanKey = Symbol() as InjectionKey<
  ComputedRef<WipPlan | undefined>
>;

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
