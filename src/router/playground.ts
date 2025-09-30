import Index from "@/pages/playground/Index.vue";
import type { RouteRecordRaw } from "vue-router";

export const playground: RouteRecordRaw[] = [
  {
    path: "/playground",
    name: "playground",
    component: Index,
    meta: {
      permissionKey: import.meta.env.VITE_PLAYGROUND_KEY,
    },
  },
];
