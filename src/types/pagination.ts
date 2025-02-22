export interface SimplePaginate<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
}
export type SimplePaginateObject<T> = Omit<SimplePaginate<T>, "data"> & {
  data: T;
};
/**
 * For responses that uses Laravel API Resources
 */
export interface SimplePaginateAPIResource<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  };
  meta: {
    current_page: number;
    from: number;
    path: string;
    per_page: number;
    to: number;
  };
}
