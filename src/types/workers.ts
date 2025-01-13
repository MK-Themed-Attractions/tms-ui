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
}

export interface WorkerForm {
  worker_number: string;
  given_name: string;
  last_name: string;
  rfid_card: string;
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
