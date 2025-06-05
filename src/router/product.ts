import type {
  RouteLocationNormalizedGeneric,
  RouteRecordRaw,
} from "vue-router";
import { defineStore } from "pinia";

import { useCustomLabelStore } from "@/stores/customLabelStore";

export const productRoutes: RouteRecordRaw[] = [
  {
    path: "products",
    name: "products",
    redirect: { name: "productIndex" },
    component: () => import("@/pages/products/Index.vue"),
    meta: {
      requiresAuth: true,
      permissionKey: import.meta.env.VITE_PRODUCTS_KEY,
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
      {
        path: "custom-labels",
        name: "customLabel",
        redirect: { name: "customLabelList" },
        props: true,
        children: [
          {
            path: "",
            name: "customLabelList",
            component: () => import("@/pages/products/custom-labels/Index.vue"),
            props: true,
            beforeEnter: checkCustomLabel,
          },
          {
            path: ":customLabelID",
            name: "customLabelShow",
            component: () => import("@/pages/products/custom-labels/Show.vue"),
            props: true,
            beforeEnter: checkCustomLabel,
          },
          {
            path: "create",
            name: "customLabelCreate",
            component: () =>
              import("@/pages/products/custom-labels/Create.vue"),
          },
        ],
      },
    ],
  },
];

async function checkCustomLabel(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
) {
  const customLabelStore = useCustomLabelStore();
  const customLabelID = to.params.customLabelID;
  if (customLabelID) {
    await customLabelStore.getCustomLabel(customLabelID.toString());
  }
}
