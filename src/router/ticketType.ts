import type { RouteRecordRaw } from "vue-router";

export const ticketTypeRoutes: RouteRecordRaw[] = [
  {
    path: "/ticket-types",
    name: "ticketTypes",
    component: () => import("@/pages/ticket-types/Index.vue"),
    redirect: { name: "ticketTypesIndex" },
    meta: {
      requiresAuth: true,
      permissionKey: import.meta.env.VITE_TICKET_TYPE_KEY,
    },
    children: [
      {
        path: "",
        name: "ticketTypesIndex",
        component: () => import("@/pages/ticket-types/home/Index.vue"),
      },
      {
        path: "create",
        name: "ticketTypesCreate",
        component: () =>
          import("@/pages/ticket-types/create/TicketTypesCreate.vue"),
        meta: {
          permissionKey: import.meta.env.VITE_TICKET_TYPE_CREATE_KEY,
        },
      },
      {
        path: ":id/edit",
        name: "updateTicketType",
        component: () =>
          import("@/pages/ticket-types/edit/TicketTypesEdit.vue"),
        props: true,
         meta: {
          permissionKey: import.meta.env.VITE_TICKET_TYPE_UPDATE_KEY,
        },
      },
    ],
  },
];
