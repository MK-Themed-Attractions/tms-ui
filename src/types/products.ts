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
}

export interface Image {
  image_link: string;
  large_image: string;
  small_image: string;
  thumbnail: string;
  tiny_image: string;
}

/* config for product API get method parameters */
export interface ProductQueryParameter {
  page: number;
}
