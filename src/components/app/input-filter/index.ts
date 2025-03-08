import type { Component } from "vue";

export { default as InputFilter } from "./InputFilter.vue";

export interface InputFilterProps {
  dropdownData: InputFilterDropdownData[];
  icon?: Component;
  inputPlaceHolder?: string;
  dropdownLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export interface InputFilterDropdownData {
  key: "product-sku" | "plan-code";
  value: string;
}

export interface InputFilterSearchData {
  search: string;
  filter?: InputFilterDropdownData;
}
