import { HardHat, Home, Package } from "lucide-vue-next";
import type { NavItem } from "./components/SideNavigation.vue";

export const navItemData: NavItem[] = [
  { name: "Home", to: { name: "home" }, icon: Home },
  { name: "Products", to: { name: "products" }, icon: Package },
  {
    name: "Worker management",
    to: { name: "workerManagement" },
    icon: HardHat,
  },
];
