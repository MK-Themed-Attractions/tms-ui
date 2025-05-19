import type { RouteRecordRaw } from "vue-router";

export const printRoutes: RouteRecordRaw[] = [
  {
    path: "/print",
    name: "print",
    children: [
      {
        path: "boms",
        name: "printBom",
        component: () => import("@/pages/prints/Bom.vue"),
      },
    ],
  },
];
