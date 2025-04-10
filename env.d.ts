/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCT: string;
  readonly VITE_PLANNING: string;
  readonly VITE_USERS: string;
  readonly VITE_WORKERS: string;
  readonly VITE_COMMON: string;
  readonly VITE_CASTING: string;
  readonly VITE_QC: string;
  readonly VITE_PRODUCT_BEARER_TOKEN_KEY: string;
  readonly VITE_WORKERS_BEARER_TOKEN_KEY: string;
  readonly VITE_PLANNING_BEARER_TOKEN_KEY: string;
  readonly VITE_COMMON_BEARER_TOKEN_KEY: string;
  readonly VITE_CASTING_BEARER_TOKEN_KEY: string;
  readonly VITE_QC_BEARER_TOKEN_KEY: string;
  readonly VITE_ABLY_PUBLIC_KEY: string;
  readonly VITE_S3_ENDPOINT: string;
  readonly VITE_DEV_TEAM_EMAIL: string;

  readonly VITE_PRODUCTS_KEY: string;
  readonly VITE_TASK_HISTORY_KEY: string;
  readonly VITE_WIP_KEY: string;
  readonly VITE_QC_KEY: string;
  readonly VITE_QC_KPI_KEY: string;
  readonly VITE_WORKERS_KEY: string;
  readonly VITE_WORKER_DEPARTMENTS_KEY: string;
  readonly VITE_PLANNING_KEY: string;
  readonly VITE_PLANNING_CALENDAR_KEY: string;
  readonly VITE_USERS_KEY: string;
  readonly VITE_USERS_PERMISSION_KEY: string;

  readonly VITE_SUPERADMIN_IDS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
