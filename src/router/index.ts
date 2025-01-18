import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedGeneric,
} from "vue-router";
import MainLayout from "@/layouts/main/Index.vue";
import { auth } from "./auth";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

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
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "worker-management",
          name: "workerManagement",
          component: () => import("@/pages/worker-management/Index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "worker-department",
          name: "workerDepartment",
          component: () =>
            import("@/pages/worker-management/department/Index.vue"),
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
    ...auth,
  ],
});

router.beforeEach(checkUser);

/**
 * Check for routes that require authenticated user
 *
 * @param to
 * @param from
 */
function checkUser(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
) {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  if (to.meta.requiresAuth && !user.value) {
    return { name: "login" };
  }
}

export default router;
