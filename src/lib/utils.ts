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
