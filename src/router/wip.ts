import type { RouteRecordRaw } from "vue-router";
export const wip: RouteRecordRaw[] = [
  {
    path: "/wip",
    name: "wip",
    redirect: { name: "wipIndex" },
    component: () => import("@/pages/wip/Index.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "wipIndex",
        component: () => import("@/pages/wip/home/Index.vue"),
        meta: {
          permissionKey: import.meta.env.VITE_WIP_KEY,
        },
      },
    ],
  },
];
