export const routingMicroservices = [
  "common",
  "casting",
  "assembly",
  "metal",
  "detailing",
  "packing",
  "sanding",
  "painting",
  "planning",
  "products",
  "users",
  "qc",
  "workers",
  "ui",
] as const;

export type RoutingMicroserviceType = (typeof routingMicroservices)[number];
