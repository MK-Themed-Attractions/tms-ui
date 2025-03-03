import type { PlanStatusCode } from "@/types/planning";
import type { TaskStatus } from "@/types/wip";
import { type ClassValue, clsx } from "clsx";
import {
  AlertCircle,
  Archive,
  Clock,
  Flag,
  HelpCircle,
  Pause,
  RefreshCcw,
  Slash,
  ThumbsDown,
  XCircle,
} from "lucide-vue-next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReadableDate(isoDateString: string) {
  // Parse the ISO string into a Date object
  const date = new Date(isoDateString);

  // Options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
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
    case "paused":
      return Pause;
  }
}
