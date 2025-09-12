import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import type { NavItem } from "./components/SideNavigation.vue";

export function usePermission() {
  const authStore = useAuthStore();
  const { userPermissionSet, user } = storeToRefs(authStore);

  function hasPermission(key?: string) {
    if (!key || !user.value || !userPermissionSet.value) return false;

    return userPermissionSet.value.includes(key) || isAdmin(user.value.id);
  }

  function isAdmin(userId: string) {
    const adminKeys = <string[]>JSON.parse(import.meta.env.VITE_SUPERADMIN_IDS);
    return adminKeys.includes(userId);
  }

  /**
   * this will return true if one of the navigation children's permissionKey
   * has at-least 1 matched permission set on the user
   */
  function someChildHasPermission(children?: NavItem[]) {
    if (!children) return true;
    return children.some((child) => {
      return hasPermission(child.permissionKey);
    });
  }

  return {
    hasPermission,
    someChildHasPermission,
    isAdmin,
  };
}
