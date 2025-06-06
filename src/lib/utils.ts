import type { PlanStatusCode } from "@/types/planning";
import type { TaskStatus } from "@/types/wip";
import {
  AlertCircle,
  Archive,
  Clock,
  Flag,
  HelpCircle,
  Pause,
  RefreshCcw,
  Settings,
  Slash,
  ThumbsDown,
  ThumbsUp,
} from "lucide-vue-next";
import type { Updater } from "@tanstack/vue-table";
import type { Ref } from "vue";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { rand } from "@vueuse/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref,
) {
  ref.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

export function formatReadableDate(isoDateString: string) {
  // Parse the ISO string into a Date object
  const date = new Date(isoDateString);

  // Options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  // Format the date to a readable string
  return date.toLocaleString("en-US", options);
}

/**
 * transform raw link into s3
 * @param link raw link without s3
 * @return string;
 */
type S3ImageType = "thumbnail" | "small" | "medium" | "large" | "full";

export function getS3Link(link: string, type: S3ImageType = "full") {
  const endpoint = import.meta.env.VITE_S3_ENDPOINT;

  // Ensure exactly one slash between endpoint and link
  const trimedEnpoint = endpoint.replace(/\/+$/, "");
  const trimedLink = link.replace(/^\/+/, "");

  switch (type) {
    case "full":
      return `${trimedEnpoint}/${trimedLink}`;
    case "large":
      return `${trimedEnpoint}/thumbs/600x600/${trimedLink}`;
    case "medium":
      return `${trimedEnpoint}/thumbs/300x300/${trimedLink}`;
    case "small":
      return `${trimedEnpoint}/thumbs/150x150/${trimedLink}`;
    case "thumbnail":
      return `${trimedEnpoint}/thumbs/${trimedLink}`;
  }
}

/**
 * Transform the number input to ordinal string e.g. 1st 2nd 3rd
 * @param n number to be converted
 * @returns number transformed in an ordinal form
 */
export function toOrdinal(n: number) {
  if (typeof n !== "number" || !Number.isInteger(n)) {
    throw new Error("Input must be an integer.");
  }

  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;

  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Get icon component based on plan status
 * @param status plan status code
 * @returns Icon component
 */
export function getIconByPlanStatus(status: PlanStatusCode) {
  switch (status) {
    case "pending":
      return Clock;
    case "ongoing":
      return RefreshCcw;
    case "finished":
      return Flag;
    case "archived":
      return Archive;
    case "cancelled":
      return Slash;
    case "undefined":
      return AlertCircle;
  }
}

/**
 * Get icon component based on Wip task status
 * @param status WIP task status code
 * @returns Icon component
 */
export function getIconByTaskStatus(status: TaskStatus) {
  switch (status) {
    case "unassigned":
      return HelpCircle;
    case "cancelled":
      return Slash;
    case "done":
      return Flag;
    case "ongoing":
      return RefreshCcw;
    case "pending":
      return Clock;
    case "qc-failed":
      return ThumbsDown;
    case "qc-passed":
      return ThumbsUp;
    case "paused":
      return Pause;
    case "override":
      return Settings;
  }
}

export function msTeamLink() {
  return `https://teams.microsoft.com/l/chat/0/0?users=${import.meta.env.VITE_DEV_TEAM_EMAIL}`;
}

/**
 * Get Random HEX color based on tailwind colors
 * @returns string HEX color code
 */
export function getRandomColor() {
  const randomColors = [
    "#f87171",
    "#fb923c",
    "#fbbf24",
    "#facc15",
    "#a78bfa",
    "#a5b4fc",
    "#60a5fa",
    "#60a5fa",
    "#38bdf8",
    "#22d3ee",
    "#22d3ee",
    "#2dd4bf",
    "#34d399",
    "#4ade80",
    "#a3e635",
    "#a8a29e",
    "#a3a3a3",
    "#a1a1aa",
    "#9ca3af",
    "#94a3b8",
  ];

  return randomColors[rand(0, randomColors.length - 1)];
}
