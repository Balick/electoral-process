import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: number) => `${String(time).padStart(2, "0")}`;

/**
 * Calcule le temps restant à partir de la date de fin
 * @param endDate Date de fin
 * @returns Objet contenant les heures, minutes et secondes restants
 */
export const calculateTimeLeft = (endDate: Date) => {
  const difference = endDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};
