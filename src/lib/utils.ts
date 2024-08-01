import { USER_FACING_EXCEPTION_MESSAGES } from "@/domain/messages/exception-messages";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function getUserFacingErrorMessage(message: string) {
  return (
    (USER_FACING_EXCEPTION_MESSAGES as Record<string, string>)[message] ||
    message
  );
}
