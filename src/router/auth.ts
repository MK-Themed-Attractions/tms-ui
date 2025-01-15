import Login from "@/pages/auth/Login.vue";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import type {
  RouteLocationNormalizedGeneric,
  RouteRecordRaw,
} from "vue-router";

export const auth: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: checkUser,
  },
];

/**
 * Check the user if it is already exists,
 * if it is, then go to home page
 * oterwise, proceed to login
 * @param to
 * @param from
 */
function checkUser(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
) {
  const authStore = useAuthStore();
  const { user, errors } = storeToRefs(authStore);

  if (user.value && !errors.value) {
    return { name: "home" };
  }
}
