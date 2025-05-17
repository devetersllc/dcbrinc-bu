import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function areFieldsEmpty(obj: object) {
  return Object.values(obj).some(
    (value) => value === undefined || value === ""
  );
}
