import type { RouteRecordRaw } from "vue-router";

export const users: RouteRecordRaw[] = [
  {
    path: "user-management",
    name: "users",
    component: () => import("@/pages/user-management/Index.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "userIndex",
        component: () => import("@/pages/user-management/home/Index.vue"),
        meta: {
          permissionKey: import.meta.env.VITE_USERS_KEY,
        },
      },
      {
        path: "roles-and-permissions",
        name: "permissionIndex",
        component: () =>
          import("@/pages/user-management/permission/home/Index.vue"),
        meta: {
          permissionKey: import.meta.env.VITE_USERS_PERMISSION_KEY,
        },
      },
    ],
  },
  {
    path: "profile",
    name: "profile",
    component: () => import("@/pages/user-management/profile/Index.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
