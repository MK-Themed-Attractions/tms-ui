/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCT_URL: string;
  readonly VITE_PLANNING_URL: string;
  readonly VITE_USERS_URL: string;
  readonly VITE_WORKERS_URL: string;
  readonly VITE_PRODUCT_BEARER_TOKEN_KEY: string;
  readonly VITE_WORKER_BEARER_TOKEN_KEY: string;
  readonly VITE_PLANNING_BEARER_TOKEN_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
