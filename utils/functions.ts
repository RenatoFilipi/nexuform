import { differenceInDays, formatDistance } from "date-fns";
import { customAlphabet } from "nanoid";
import { redirect } from "next/navigation";
import { TBlock } from "./types";

export const uuid = () => {
  const uuid = self.crypto.randomUUID();
  return uuid;
};
export const nanoid = (
  length: number = 12,
  onlyLetters: boolean = false,
  onlyLowercase: boolean = false
): string => {
  let alphabet =
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (onlyLetters) {
    alphabet = onlyLowercase
      ? "abcdefghijklmnopqrstuvwxyz"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  } else if (onlyLowercase) {
    alphabet = "1234567890abcdefghijklmnopqrstuvwxyz";
  }
  alphabet = alphabet.replace(/[^a-zA-Z0-9]/g, "");
  const nnid = customAlphabet(alphabet, length);
  return nnid();
};
export const blockName = (type: TBlock) => {
  switch (type) {
    case "short_text":
      return "Short Text";
    case "paragraph_text":
      return "Paragraph Text";
    case "multiple_choice":
      return "Multiple Choice";
    case "checkboxes":
      return "Checkboxes";
    case "dropdown_menu":
      return "Dropdown Menu";
    case "number_input":
      return "Number";
    case "email_address":
      return "Email Address";
    case "star_rating":
      return "Star Rating";
    case "custom_scale":
      return "Custom Scale";
  }
};
export const formatDateRelativeToNow = (isoDate: string) => {
  const date = new Date(isoDate);
  return formatDistance(date, new Date(), {
    addSuffix: true,
  });
};
export const encodedRedirect = (
  type: "error" | "success",
  path: string,
  message: string
): never => {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
};
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const formatTime = (time: number, decimalPlaces: number = 3) => {
  const totalSeconds = Math.floor(time / 1000);
  const milliseconds = time % 1000;
  const formattedMilliseconds = (milliseconds / 1000)
    .toFixed(decimalPlaces)
    .slice(2);

  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}.${formattedMilliseconds}s`;
  }

  return `${totalSeconds}.${formattedMilliseconds}s`;
};
export const formatDecimal = (num: number, decimals: number = 1): string => {
  if (num % 1 === 0 || decimals === 0) {
    return num.toString();
  }
  return num.toFixed(decimals);
};
export const calculateAverageCompletionTime = (times: number[]): number => {
  const total = times.reduce((sum, time) => sum + time, 0);
  return total / times.length;
};
export const getDateRange = (days: number) => {
  const now = new Date().toISOString();
  return {
    from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
    to: now,
  };
};
export const getDaysDifference = (startDate: Date, endDate: Date) => {
  return differenceInDays(endDate, startDate);
};
