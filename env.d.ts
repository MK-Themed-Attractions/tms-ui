/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCT: string;
  readonly VITE_PLANNING: string;
  readonly VITE_USERS: string;
  readonly VITE_WORKERS: string;
  readonly VITE_COMMON: string;
  readonly VITE_CASTING: string;
  readonly VITE_QC: string;
  readonly VITE_INVENTORY: string;
  readonly VITE_NOTIFICATIONS: string;
  readonly VITE_TICKET: string;

  readonly VITE_PRODUCT_BEARER_TOKEN_KEY: string;
  readonly VITE_WORKERS_BEARER_TOKEN_KEY: string;
  readonly VITE_PLANNING_BEARER_TOKEN_KEY: string;
  readonly VITE_COMMON_BEARER_TOKEN_KEY: string;
  readonly VITE_CASTING_BEARER_TOKEN_KEY: string;
  readonly VITE_QC_BEARER_TOKEN_KEY: string;
  readonly VITE_INVENTORY_BEARER_TOKEN_KEY: string;
  readonly VITE_NOTIFICATIONS_BEARER_TOKEN_KEY: string;
  readonly VITE_TICKET_BEARER_TOKEN_KEY: string;

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
  readonly VITE_OUTPUT_POSTING_KEY: string;
  readonly VITE_OUTPUT_POSTING_TO_BC_KEY: string;
  readonly VITE_OUTPUT_POSTING_SELECTION_KEY: string;
  readonly VITE_INVENTORY_KEY: string;

  readonly VITE_TICKET_KEY: string;
  readonly VITE_TICKET_CREATE_KEY: string;
  readonly VITE_TICKET_SHOW_KEY: string;
  readonly VITE_TICKET_UPDATE_KEY: string;
  readonly VITE_TICKET_CHANGE_STATUS_KEY: string;
  readonly VITE_TICKET_DELETE_KEY: string;
  readonly VITE_TICKET_TYPE_KEY: string;
  readonly VITE_TICKET_TYPE_SHOW_KEY: string;
  readonly VITE_TICKET_TYPE_CREATE_KEY: string;
  readonly VITE_TICKET_TYPE_UPDATE_KEY: string;
  readonly VITE_TICKET_TYPE_DELETE_KEY: string;

  readonly VITE_SUPERADMIN_IDS: string;

  /* Feature: Production Tag */
  readonly VITE_PROD_TAG_FIXED_WORK_CENTER: string;
  readonly VITE_PRINT_PROD_TAG_KEY: string;

  /* Feature:  */
  readonly VITE_LABEL_PRINTING: string;

  /* Ticket access */
  readonly VITE_TICKET_ENC_ACCESS_KEY: string;
  readonly VITE_TICKET_ENC_ID: string;
  readonly VITE_TICKET_TAG_ACCESS_KEY: string;
  readonly VITE_TICKET_TAG_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
