import {
  Building,
  Calendar,
  Clipboard,
  ContactRound,
  HardHat,
  History,
  Home,
  Package,
  SearchCheck,
  Shield,
  TrendingUp,
  User,
  UserCircle,
  Wrench,
} from "lucide-vue-next";
import type { NavItem } from "./components/SideNavigation.vue";

export const navItemData: NavItem[] = [
  { name: "Home", to: { name: "home" }, icon: Home },
  { name: "Products", to: { name: "productIndex" }, icon: Package },
  {
    name: "Task History",
    to: { name: "taskHistoryIndex" },
    icon: History,
  },
  { name: "Work in progress", to: { name: "wipIndex" }, icon: Wrench },
  {
    name: "Quality control",
    icon: SearchCheck,
    children: [
      {
        name: "Product inspection",
        icon: Clipboard,
        to: { name: "qcIndex" },
      },
      {
        name: "KPI",
        icon: TrendingUp,
        to: { name: "kpiIndex" },
      },
    ],
  },
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
  {
    name: "User management",
    icon: UserCircle,
    children: [
      {
        to: { name: "userIndex" },
        icon: User,
        name: "Users",
      },
      {
        to: { name: "permissionIndex" },
        icon: Shield,
        name: "Roles and permissions",
      },
    ],
  },
];
