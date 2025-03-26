import type { QueryParams } from "./auth";

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
}

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

export interface WorkerQueryParams extends QueryParams {}
export interface WorkerDepartmentQueryParams extends QueryParams {}
