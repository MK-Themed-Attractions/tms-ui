import Index from "@/pages/worker-dashboard/home/Index.vue";
import type { RouteRecordRaw } from "vue-router";

export const workerDashboard: RouteRecordRaw[] = [
  {
    path: "/worker-dashboard",
    name: "workerDashboard",
    component: Index,
    meta: {
      requiresAuth: true,
    },
  },
];
