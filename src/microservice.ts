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
] as const;

export type RoutingMicroserviceType = (typeof routingMicroservices)[number];
