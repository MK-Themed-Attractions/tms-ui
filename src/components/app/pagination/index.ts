export { default as PaginationApp } from "./PaginationApp.vue";
export { default as PaginationApp2 } from "./PaginationApp2.vue";
export { default as PaginationButtonsApp } from "./PaginationButtonsApp.vue";
export { default as PaginationPerPageApp } from "./PaginationPerPageApp.vue";

export interface PaginationAppProps {
  pageName?: string;
  perPageName?: string;
  defaultPerPage?: number;
}

export interface PaginationQuery {
  page: number|string;
  perPage: string|number;
}

export interface PaginationButtonsAppProps {
  disablePrev?: boolean;
  disableNext?: boolean;
  loading?:boolean
}
