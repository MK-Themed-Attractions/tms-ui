import type { RouteRecordRaw } from "vue-router";

export const planning: RouteRecordRaw[] = [
  {
    path: "/planning",
    name: "planning",
    redirect: { name: "planningIndex" },
    component: () => import("@/pages/planning/Index.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "planningIndex",
        component: () => import("@/pages/planning/home/Index.vue"),
      },
    ],
  },
];
