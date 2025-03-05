import {
  Building,
  Calendar,
  Clipboard,
  ContactRound,
  HardHat,
  Home,
  Package,
  Wrench,
} from "lucide-vue-next";
import type { NavItem } from "./components/SideNavigation.vue";

export const navItemData: NavItem[] = [
  { name: "Home", to: { name: "home" }, icon: Home },
  { name: "Products", to: { name: "productIndex" }, icon: Package },
  { name: "Work in progress", to: { name: "wipIndex" }, icon: Wrench },
  {name: "Quality control", to : {name:'qcIndex'}, icon: Clipboard },
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
    to: { name: "planningIndex" },
    icon: Calendar,
  },
];
