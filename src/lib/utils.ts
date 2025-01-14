import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isThereAnError = (error: any, message?: string) => {
  if (error) {
    console.error(`${message}`, error.message);
    return true;
  }
  return false;
};
