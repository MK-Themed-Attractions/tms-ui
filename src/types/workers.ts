import type { QueryParams } from "./general";

export interface Worker {
  worker_number: string;
  given_name: string;
  last_name: string;
  rfid_card: string;
  updated_at: string;
  created_at: string;
  id: string;
  full_name: string;
  department?: WorkerDepartment;
  work_centers?: string[];
  is_active: boolean;
  points?: WorkerPoint;
  run_time?: WorkerRuntime;
}

export interface WorkerPoint {
  current_day: number;
  current_month: number;
  current_year: number;
}

export interface WorkerRuntime extends WorkerPoint {}

export interface WorkerForm {
  worker_number: string;
  given_name: string;
  last_name: string;
  rfid_card: string;
  department_id: string;
  is_active?: boolean;
}

export interface WorkerDepartment {
  code: string;
  name: string;
  description: string;
  updated_at: string;
  created_at: string;
  id: string;
  ms_url: string;
  worker_count: number;
  work_centers: string[];
}

export interface WorkerDepartmentForm {
  code: string;
  name: string;
  description?: string;
  work_centers: string[];
  ms_url: string; // ENV KEY to point to microservice URL
}

export interface WorkerQueryParams extends QueryParams {
  appends: string[];
}
export interface WorkerDepartmentQueryParams extends QueryParams {}
