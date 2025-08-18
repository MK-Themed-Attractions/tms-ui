import type { RouteRecordRaw } from "vue-router";

export const ticketTypeRoutes: RouteRecordRaw[] = [
  {
    path: "/ticket-types",
    name: "ticketTypes",
    component: () => import("@/pages/ticket/Index.vue"),
    redirect: { name: "ticketTypesIndex" },
    meta: {
      requiresAuth: true,
      permissionKey: import.meta.env.VITE_TICKET_KEY,
    },
    children: [
      {
        path: "",
        name: "ticketTypesIndex",
        component: () => import("@/pages/ticket-types/home/Index.vue"),
      },
    ],
  },
];
