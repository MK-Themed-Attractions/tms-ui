/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCT_URL: string;
  readonly VITE_PLANNING_URL: string;
  readonly VITE_USERS_URL: string;
  readonly VITE_WORKERS_URL: string;
  readonly VITE_COMMON_URL: string;
  readonly VITE_PRODUCT_BEARER_TOKEN_KEY: string;
  readonly VITE_WORKER_BEARER_TOKEN_KEY: string;
  readonly VITE_PLANNING_BEARER_TOKEN_KEY: string;
  readonly VITE_COMMON_BEARER_TOKEN_KEY: string;
  readonly VITE_ABLY_PUBLIC_KEY: string;
  readonly VITE_S3_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
