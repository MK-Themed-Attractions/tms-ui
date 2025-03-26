import type { RouteRecordRaw } from "vue-router";

export const taskHistory: RouteRecordRaw[] = [
  {
    path: "task-history",
    name: "taskHistory",
    component: () => import("@/pages/task-history/Index.vue"),
    meta: {
      requiresAuth: true,
      permissionKey: import.meta.env.VITE_TASK_HISTORY_KEY,
    },
    children: [
      {
        path: "",
        name: "taskHistoryIndex",
        component: () => import("@/pages/task-history/home/Index.vue"),
      },
    ],
  },
];
