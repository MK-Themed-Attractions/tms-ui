import { type ClassValue, clsx } from "clsx";
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
export function getS3Link(link: string) {
  return `${import.meta.env.VITE_S3_ENDPOINT}${link}`;
}
