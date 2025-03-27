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
        redirect: { name: "roles" },
        component: () =>
          import("@/pages/user-management/permission/home/Index.vue"),
        children: [
          {
            path: "roles",
            name: "roles",
            component: () =>
              import(
                "@/pages/user-management/permission/home/components/Roles.vue"
              ),
          },
          {
            path: "permissions",
            name: "permissions",
            component: () =>
              import(
                "@/pages/user-management/permission/home/components/Permissions.vue"
              ),
          },
        ],
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
