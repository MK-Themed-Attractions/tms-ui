import type { QueryParams } from "./auth";

export interface Product {
  created_at: string;
  updated_at: string;
  description: string;
  dimension_height: number;
  dimension_length: number;
  dimension_width: number;
  volume: number;
  weight_gross: number;
  weight_net: number;
  id: string;
  images?: Image[];
  parent_code: string;
  sku: string;
  title: string;
  routings?: ProductRouting[];
  product_bom_no: string;
  routing_link_code: string;
}

export interface ProductRouting {
  created_at: string;
  id: string;
  index: number;
  is_autocomplete: boolean;
  manpower: number;
  next_operation: ProductRoutingOperationLetter[];
  operation_code: string;
  operation_number: string;
  previous_operation: any;
  routing_no: string;
  runtime: number;
  updated_at: string;
  workcenters: ProductRoutingWorkcenter;
}

export interface ProductRoutingWorkcenter {
  no: string;
  name: string;
  group_code: string;
  search_name: string;
  created_at: string;
  updated_at: string;
  id: string;
}

export interface Image {
  image_link: string;
  large_image: string;
  small_image: string;
  thumbnail: string;
  tiny_image: string;
}

export interface ProductRoutingBOM {
  production_bom_no: string;
  no: string;
  description: string;
  quantity_per: number;
  unit_of_measure_code: string;
  routing_link_code: string;
}

export interface ProductAttachment {
  link: string;
  mime: string;
  name: string;
}

/* config for product API get method parameters */
export interface ProductQueryParameter extends QueryParams {}

export interface ProductShowQueryParams {
  includes: string;
}

export interface ProductRoutingQueryParams {
  routing_link_code: string;
}

export type ProductRoutingOperationLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
