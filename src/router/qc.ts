import type { RouteRecordRaw } from "vue-router";

export const qc: RouteRecordRaw[] = [
  {
    path: "qc",
    name: "qc",
    component: () => import("@/pages/qc/Index.vue"),
    redirect: { name: "qcIndex" },
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "qcIndex",
        component: () => import("@/pages/qc/home/Index.vue"),
        meta: {
          permissionKey: import.meta.env.VITE_QC_KEY,
        },
      },
      {
        path: "kpi",
        name: "kpiIndex",
        component: () => import("@/pages/qc/kpi/Index.vue"),
        meta: {
          permissionKey: import.meta.env.VITE_QC_KPI_KEY,
        },
      },
    ],
  },
];
