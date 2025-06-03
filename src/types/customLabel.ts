import type { QueryParams } from "./general";

// Custom Label
export interface CustomLabelQueryParams extends QueryParams {}
export interface CustomLabel {
  id: string;
  title: string;
  parameters: Parameters[];
  label_parameters: LabelParameter[];
  html_code: string;
  custom_data?: CustomLabelData[];
}
export type CustomLabelPostPayload = Omit<CustomLabel, "id"> & {
  id?: string;
  custom_data?: CustomLabelData[];
};
export interface Parameters {
  key: string;
  desc: string;
  value?: string;
}
export interface LabelParameter {
  key: string;
  desc: string;
  value: LabelParameterValue;
}
export type LabelParameterValue =
  | "sku"
  | "description"
  | "title"
  | "parent_code"

  | "image"
  | "Height (cm)"
  | "Length (cm)"
  | "Width (cm)"

  | "Volume (cb.m)"
  | "GW (kgs)"
  | "NW (kgs)"

  | "Height (in)"
  | "Length (in)"
  | "Width (in)"
  
  | "Volume (cb.ft)"
  | "GW (lbs)"
  | "NW (lbs)";
export enum LabelParameterValueList {
  "sku" = "sku",
  "description" = "description",
  "title" = "title",
  "parent_code" = "parent_code",
  "image" = "image",
  "Height (cm)" = "Height (cm)",
  "Length (cm)" = "Length (cm)",
  "Width (cm)" = "Width (cm)",
  "Volume (cb.m)" = "Volume (cb.m)",
  "GW (kgs)" = "GW (kgs)",
  "NW (kgs)" = "NW (kgs)",
  "Height (in)" = "Height (in)",
  "Length (in)" = "Length (in)",
  "Width (in)" = "Width (in)",
  "Volume (cb.ft)" = "Volume (cb.ft)",
  "GW (lbs)" = "GW (lbs)",
  "NW (lbs)" = "NW (lbs)",
}
// Custom Label Data
export interface CustomDataParameter {
  key: string;
  value: string;
}
export interface CustomLabelData {
  id: string;
  sku: string;
  custom_label_id: string;
  data: CustomDataParameter[];
}
export type CustomLabelDataPostPayload = Omit<CustomLabelData, "id"> & {
  id?: string;
};
