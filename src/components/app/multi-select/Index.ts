export { default as MultiSelect } from "./MultiSelect.vue";
export { default as MultiSelectValue } from "./MultiSelectValue.vue";

export interface MultiSelectProps<T> {
  items: T[] | string[];
  maxDisplayCount?: number;
  idKey?: string;
  valueKey?: string;
  returnKey?: keyof T;
  placeholder?: string;
}
