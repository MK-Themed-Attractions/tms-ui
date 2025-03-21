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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
