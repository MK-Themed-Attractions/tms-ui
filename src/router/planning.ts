import { usePlanStore } from "@/stores/planStore";
import type {
  RouteLocationNormalizedGeneric,
  RouteRecordRaw,
} from "vue-router";

export const planning: RouteRecordRaw[] = [
  {
    path: "/planning",
    name: "planning",
    redirect: { name: "planningIndex" },
    component: () => import("@/pages/planning/Index.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "planningIndex",
        component: () => import("@/pages/planning/home/Index.vue"),
      },
      {
        path: ":planId",
        name: "planningShow",
        component: () => import("@/pages/planning/show/Index.vue"),
        props: true,
        beforeEnter: checkPlan,
      },
      {
        path: "create",
        name: "planningCreate",
        component: () => import("@/pages/planning/create/Index.vue"),
      },
    ],
  },
];

async function checkPlan(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
) {
  const planStore = usePlanStore();

  const planId = to.params.planId;

  if (planId)
    await planStore.getPlan(planId.toString(), {
      includes: "batches",
    });
}
