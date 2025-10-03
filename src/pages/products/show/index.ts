export const productResourceTypes = [
  "TDI",
  "TDP",
  "PANTONE",
  "MANUAL",
] as const;


export type ProductResourceType = typeof productResourceTypes[number];