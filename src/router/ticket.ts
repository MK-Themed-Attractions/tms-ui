import type { RouteRecordRaw } from "vue-router";

export const ticketRoutes: RouteRecordRaw[] = [
  {
    path: "/ticket",
    name: "ticket",
    component: () => import("@/pages/ticket/Index.vue"),
    redirect: { name: "ticketIndex" },
    meta: {
      requiresAuth: true,
      permissionKey: import.meta.env.VITE_TICKET_KEY,
    },
    children: [
      {
        path: "",
        name: "ticketIndex",
        component: () => import("@/pages/ticket/home/Index.vue"),
      },
      {
        path: "create",
        name: "ticketCreate",
        component: () => import("@/pages/ticket/create/TicketCreate.vue"),
        meta: {
          permissionKey: import.meta.env.VITE_TICKET_CREATE_KEY,
        }
      },
      {
        path: ":id/edit",
        name: "updateTicket",
        component: () => import("@/pages/ticket/edit/TicketEdit.vue"),
        props: true,
        meta: {
          permissionKey: import.meta.env.VITE_TICKET_UPDATE_KEY,
        }
      },
    ],
  },
];
