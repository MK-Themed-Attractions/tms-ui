export const routingMicroservices = [
  "common",
  "casting",
  "assembly",
  "metal",
  "detailing",
  "packing",
  "sanding",
] as const;

export type RoutingMicroserviceType = (typeof routingMicroservices)[number];
