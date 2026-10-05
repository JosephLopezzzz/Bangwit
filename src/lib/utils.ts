import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts (used by Lightswind components). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
