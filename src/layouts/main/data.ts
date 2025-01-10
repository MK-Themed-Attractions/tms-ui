import {
  Building,
  Calendar,
  Calendar1,
  ContactRound,
  HardHat,
  Home,
  Package,
} from "lucide-vue-next";
import type { NavItem } from "./components/SideNavigation.vue";

export const navItemData: NavItem[] = [
  { name: "Home", to: { name: "home" }, icon: Home },
  { name: "Products", to: { name: "products" }, icon: Package },
  {
    name: "Worker management",
    icon: HardHat,
    children: [
      {
        to: { name: "workerManagement" },
        icon: ContactRound,
        name: "Workers",
      },
      {
        to: { name: "workerDepartment" },
        icon: Building,
        name: "Department",
      },
    ],
  },
  {
    name: "Planning",
    to: { name: "home" },
    icon: Calendar,
  },
];
