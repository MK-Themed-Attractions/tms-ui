import type { RouteLocationRaw, RouteRecordRaw } from "vue-router";

export const outputPosting: RouteRecordRaw[] = [
  {
    path: "output-posting",
    name: "outputPosting",
    component: () => import("@/pages/output-posting/Index.vue"),
    meta: {
      requiresAuth: true,
      permissionKey: import.meta.env.VITE_OUTPUT_POSTING_KEY,
    },
  },
];
