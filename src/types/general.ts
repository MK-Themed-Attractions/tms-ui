export interface TimeStamp {
  created_at: string;
  updated_at: string;
}

export interface FilterQueryParams {
  column: string;
  values: string[];
  operation?: "and" | "or";
}

export interface QueryParams {
  q: string;
  page: number | string;
  per_page: number | string;
  includes: string;
  filters: FilterQueryParams[];
}
