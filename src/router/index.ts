import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/main/Index.vue";
import Login from "@/pages/auth/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: MainLayout,
      redirect: { name: "home" },
      children: [
        {
          path: "home",
          name: "home",
          component: () => import("@/pages/Index.vue"),
        },
        {
          path: "products",
          name: "products",
          component: () => import("@/pages/products/Index.vue"),
        },
        {
          path: "worker-management",
          name: "workerManagement",
          component: () => import("@/pages/worker-management/Index.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
  ],
});

export default router;
