import type { RouteRecordRaw } from "vue-router";

export const inventory: RouteRecordRaw[] = [
  {
    path: "/",
    name: "inventory",
    component: () => import("@/pages/inventory/Index.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "inventory",
        name: "inventoryIndex",
        component: () => import("@/pages/inventory/home/Index.vue"),
      },
    ],
  },
];
