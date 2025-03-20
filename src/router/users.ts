import type { RouteRecordRaw } from "vue-router";

export const users: RouteRecordRaw[] = [
  {
    path: "user-management",
    name: "users",
    component: () => import("@/pages/user-management/Index.vue"),
    children: [
      {
        path: "",
        name: "userIndex",
        component: () => import("@/pages/user-management/home/Index.vue"),
      },
      {
        path: "roles-and-permissions",
        name: "permissionIndex",
        component: () =>
          import("@/pages/user-management/permission/home/Index.vue"),
      },
    ],
  },
];
