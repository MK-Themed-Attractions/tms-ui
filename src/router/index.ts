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
import { errorPages } from "./errorPages";
import { outputPosting } from "./outputPosting";
import { inventory } from "./inventory";
import { printRoutes } from "./prints";
import { productRoutes } from "./product";
import { ticketRoutes } from "./ticket";
import { ticketTypeRoutes } from "./ticketType";
import { playground } from "./playground";

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
        ...productRoutes,
        {
          path: "worker-management",
          name: "workerManagement",
          component: () => import("@/pages/worker-management/Index.vue"),
          meta: {
            requiresAuth: true,
            permissionKey: import.meta.env.VITE_WORKERS_KEY,
          },
        },
        {
          path: "worker-department",
          name: "workerDepartment",
          component: () =>
            import("@/pages/worker-management/department/Index.vue"),
          meta: {
            requiresAuth: true,
            permissionKey: import.meta.env.VITE_WORKER_DEPARTMENTS_KEY,
          },
        },
        ...planning,
        ...wip,
        ...qc,
        ...taskHistory,
        ...users,
        ...outputPosting,
        ...errorPages,
        ...inventory,
        ...ticketRoutes,
        ...ticketTypeRoutes,
        ...playground,
      ],
    },
    ...auth,
    ...workerDashboard,
    ...printRoutes,
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
  const { requiresAuth, permissionKey } = to.meta;

  /* checking for authenticated user */
  if (requiresAuth && !user.value) {
    return { name: "login" };
  }

  /* checking for user permission */
  const superAdmins = JSON.parse(
    import.meta.env.VITE_SUPERADMIN_IDS,
  ) as string[];

  if (permissionKey && user.value) {
    const hasPermission = userPermissionSet.value.includes(
      permissionKey as string,
    );
    const isSuperAdmin = superAdmins.includes(user.value.id);

    if (!hasPermission && !isSuperAdmin) {
      return {
        name: "notFound",
        params: { pathMatch: to.path.substring(1).split("/") },
        query: to.query,
      };
    }
  }
}

export default router;
