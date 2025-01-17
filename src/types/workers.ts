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
  worker_count: number;
}

export interface WorkerDepartmentForm {
  code: string;
  name: string;
  description?: string;
}

export interface WorkerQueryParams extends QueryParams {}
export interface WorkerDepartmentQueryParams extends QueryParams {}

export interface QueryParams {
  q: string;
  page: number;
  per_page: number;
  includes: string;
  filters: FilterQueryParams[];
}

export interface FilterQueryParams {
  column: string;
  values: string[];
  operation?: "and" | "or";
}
