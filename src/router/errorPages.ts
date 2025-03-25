import type { RouteRecordRaw } from "vue-router";

export const errorPages: RouteRecordRaw[] = [
  {
    path: ":pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/pages/http-errors/NotFoundPage.vue"),
  },
];
