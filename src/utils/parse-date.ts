import type { Timestamp } from "firebase/firestore";

export function parseDate(date: string | Timestamp | undefined): Date | null {
  if (!date) return null;

  if (typeof date === "string" || typeof date === "number") {
    return new Date(date);
  }

  if (typeof date === "object" && typeof date.toDate === "function") {
    return date.toDate();
  }

  if (typeof date === "object" && "seconds" in date) {
    return new Date(date.seconds * 1000);
  }

  return null;
}
