import type { QCTaskVerdict } from "@/pages/qc/home/data";

export interface KPI {
  title: string;
  description: string;
  is_default: string;
  id: string;
}

export interface DepartmentKPI {
  department: string;
  kpi: KPI[];
  id: string;
}

export interface DepartmentKPIQueryParams {
  codes: string[];
}

export type DepartmentKPIForm = Omit<DepartmentKPI, "kpi"> & {
  kpi: (KPI & { checked?: boolean })[];
  comment?: string;
};

export interface DepartmentKPIPayload {
  status: QCTaskVerdict;
  department_kpi_id: string;
  checked_kpi_id: string[];
  comment?: string;
}
