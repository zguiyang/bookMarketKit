import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateFormat(date: string | null, format?: string) {
  if (!date) {
    return ""
  }
  return dayjs(date).format(format ?? "YYYY-MM-DD HH:mm:ss")
}
