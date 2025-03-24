import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedGeneric,
} from "vue-router";
import MainLayout from "@/layouts/main/Index.vue";
import { auth } from "./auth";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { planning } from "./planning";
import { wip } from "./wip";
import { qc } from "./qc";
import { taskHistory } from "./taskHistory";
import { users } from "./users";
import { workerDashboard } from "./workerDashboard";

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
          redirect: { name: "productIndex" },
          component: () => import("@/pages/products/Index.vue"),
          meta: {
            requiresAuth: true,
            permissionKey: "products-can-get-products",
          },
          children: [
            {
              path: "",
              name: "productIndex",
              component: () => import("@/pages/products/Product.vue"),
            },
            {
              path: ":productId",
              name: "productShow",
              component: () => import("@/pages/products/show/Index.vue"),
              props: true,
            },
          ],
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
        ...planning,
        ...wip,
        ...qc,
        ...taskHistory,
        ...users,
      ],
    },
    ...auth,
    ...workerDashboard,
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
  const { user, userPermissionSet } = storeToRefs(authStore);
  const { requiredAuth, permissionKey } = to.meta;
  if (requiredAuth && !user.value) {
    return { name: "login" };
  }

  // if (
  //   permissionKey &&
  //   !userPermissionSet.value.includes(permissionKey as string)
  // ) {
  //   return { name: "login" };
  // }
}

export default router;
