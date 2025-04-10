import {
  Building,
  Calendar,
  CalendarDays,
  CalendarFold,
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
  {
    name: "Products",
    to: { name: "productIndex" },
    icon: Package,
    permissionKey: import.meta.env.VITE_PRODUCTS_KEY,
  },
  {
    name: "Task History",
    to: { name: "taskHistoryIndex" },
    icon: History,
    permissionKey: import.meta.env.VITE_TASK_HISTORY_KEY,
  },
  {
    name: "Work in progress",
    to: { name: "wipIndex" },
    icon: Wrench,
    permissionKey: import.meta.env.VITE_WIP_KEY,
  },
  {
    name: "Quality control",
    icon: SearchCheck,
    children: [
      {
        name: "Product inspection",
        icon: Clipboard,
        to: { name: "qcIndex" },
        permissionKey: import.meta.env.VITE_QC_KEY,
      },
      {
        name: "KPI",
        icon: TrendingUp,
        to: { name: "kpiIndex" },
        permissionKey: import.meta.env.VITE_QC_KPI_KEY,
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
        permissionKey: import.meta.env.VITE_WORKERS_KEY,
      },
      {
        to: { name: "workerDepartment" },
        icon: Building,
        name: "Department",
        permissionKey: import.meta.env.VITE_WORKER_DEPARTMENTS_KEY,
      },
    ],
  },
  {
    name: "Planning",
    to: { name: "planningIndex" },
    icon: Calendar,
    permissionKey: import.meta.env.VITE_PLANNING_KEY,
  },
  {
    name: "Plan Calendar",
    to: { name: "planningCalendar" },
    icon: CalendarDays,
    permissionKey: import.meta.env.VITE_PLANNING_CALENDAR_KEY,
  },
  {
    name: "User management",
    icon: UserCircle,
    children: [
      {
        to: { name: "userIndex" },
        icon: User,
        name: "Users",
        permissionKey: import.meta.env.VITE_USERS_KEY,
      },
      {
        to: { name: "permissionIndex" },
        icon: Shield,
        name: "Roles and permissions",
        permissionKey: import.meta.env.VITE_USERS_PERMISSION_KEY,
      },
    ],
  },
];
