export { default as PaginationApp } from "./PaginationApp.vue";
export { default as PaginationButtonsApp } from "./PaginationButtonsApp.vue";
export { default as PaginationPerPageApp } from "./PaginationPerPageApp.vue";

export interface PaginationAppProps {
  pageName?: string;
  perPageName?: string;
}

export interface PaginationQuery {
  page: number;
  perPage: string;
}

export interface PaginationButtonsAppProps {
  disablePrev?: boolean;
  disableNext?: boolean;
}
