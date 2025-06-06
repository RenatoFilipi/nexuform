import { differenceInDays, formatDistance } from "date-fns";
import { enUS, es, ptBR } from "date-fns/locale";
import { customAlphabet } from "nanoid";
import { redirect } from "next/navigation";
import { createTranslator } from "use-intl/core";
import { ESubscription } from "./entities";
import { TBlock, TTemplateCategory } from "./types";

export const uuid = () => {
  const uuid = self.crypto.randomUUID();
  return uuid;
};
export const nanoid = (length: number = 12, onlyLetters: boolean = false, onlyLowercase: boolean = false): string => {
  let alphabet = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (onlyLetters) {
    alphabet = onlyLowercase ? "abcdefghijklmnopqrstuvwxyz" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  } else if (onlyLowercase) {
    alphabet = "1234567890abcdefghijklmnopqrstuvwxyz";
  }
  alphabet = alphabet.replace(/[^a-zA-Z0-9]/g, "");
  const nnid = customAlphabet(alphabet, length);
  return nnid();
};
const localeMap: Record<string, any> = {
  en: enUS,
  es: es,
  pt: ptBR,
};
export const formatDateRelativeToNow = (isoDate: string, locale: string = "en") => {
  const date = new Date(isoDate);
  const localeToUse = localeMap[locale] || enUS;
  return formatDistance(date, new Date(), {
    addSuffix: true,
    locale: localeToUse,
  });
};
export const encodedRedirect = (type: "error" | "success", path: string, message: string): never => {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
};
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const formatTime = (time: number, decimalPlaces: number = 3) => {
  const totalSeconds = Math.floor(time / 1000);
  const milliseconds = time % 1000;
  const formattedMilliseconds = (milliseconds / 1000).toFixed(decimalPlaces).slice(2);

  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}.${formattedMilliseconds}s`;
  }

  return `${totalSeconds}.${formattedMilliseconds}s`;
};
export const formatDecimal = (num: number, decimals: number = 1): string => {
  if (isNaN(num)) return "0";
  if (num % 1 === 0 || decimals === 0) {
    return num.toString();
  }
  return num.toFixed(decimals);
};
export const getDaysDifference = (startDate: Date, endDate: Date) => {
  return differenceInDays(endDate, startDate);
};
export const isSubscriptionActive = (subscription: ESubscription) => {
  const now = new Date();
  const dueDate = new Date(subscription.due_date);
  return subscription.status === "active" && dueDate >= now;
};
export const isSubmissionsLimitReached = (subscription: ESubscription, submissions: number) => {
  return submissions >= subscription.submissions;
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
export const getBlockName = async (type: TBlock, locale: string): Promise<string> => {
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  switch (type) {
    case "short_text":
      return t("app.label_short_text");
    case "paragraph_text":
      return t("app.label_paragraph_text");
    case "multiple_choice":
      return t("app.label_multiple_choice");
    case "checkboxes":
      return t("app.label_checkboxes");
    case "dropdown_menu":
      return t("app.label_dropdown_menu");
    case "number_input":
      return t("app.label_number_input");
    case "email_address":
      return t("app.label_email_address");
    case "star_rating":
      return t("app.label_star_rating");
    case "custom_scale":
      return t("app.label_custom_scale");
    case "date_picker":
      return t("app.label_date_picker");
    default:
      return "Unknown";
  }
};
export const formatDate = (unixTimestamp: number) => {
  return new Date(unixTimestamp * 1000).toISOString();
};
export const getFormCategoryName = async (category: TTemplateCategory, locale: string): Promise<string> => {
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  switch (category) {
    case "contact":
      return t("app.label_contact");
    case "feedback":
      return t("app.label_feedback");
    case "marketing":
      return t("app.label_marketing");
    case "customer-success":
      return t("app.label_customer-success");
    case "events":
      return t("app.label_events");
    case "sales":
      return t("app.label_sales");
    case "lead-generation":
      return t("app.label_lead-generation");
    case "application":
      return t("app.label_application");
    case "registration":
      return t("app.label_registration");
    case "survey":
      return t("app.label_survey");
    case "evaluation":
      return t("app.label_evaluation");
    case "order":
      return t("app.label_order");
    case "payment":
      return t("app.label_payment");
    case "onboarding":
      return t("app.label_onboarding");
    case "hr":
      return t("app.label_hr");
    case "healthcare":
      return t("app.label_healthcare");
    case "education":
      return t("app.label_education");
    case "real-estate":
      return t("app.label_real-estate");
    case "job-application":
      return t("app.label_job-application");
    default:
      return "Unknown";
  }
};
export const getAverageCompletionTime = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((t, n) => t + n, 0);
  return sum / numbers.length;
};
export const getAverageCompletionRate = (views: number, submissions: number) => {
  if (views <= 0) return 0;
  const rate = (submissions / views) * 100;
  return Math.round(rate * 100) / 100;
};
export const generateDistinctColors = (baseColor: string, count: number) => {
  // Converte a cor hexadecimal para HSL
  const hexToHsl = (hex: string) => {
    let r = 0,
      g = 0,
      b = 0;

    // Converte a cor hexadecimal para RGB
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }

    // Converte RGB para HSL
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const [baseHue] = hexToHsl(baseColor);
  const hueStep = 360 / Math.max(count, 1);

  return Array.from({ length: count }, (_, i) => {
    const hue = Math.round(baseHue + i * hueStep) % 360;
    return `hsl(${hue}, 75%, 55%)`;
  });
};

export const getPlanName = (value: string) => {
  switch (value) {
    case "free_trial":
      return "Free Trial";
    case "basic":
      return "Basic";
    case "pro":
      return "Pro";
    default:
      return "Custom";
  }
};

export const getDateDifferenceInDays = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffInMs = d2.getTime() - d1.getTime();

  return Math.abs(diffInMs) / msPerDay + 1;
};
export const getDateRangeFromToday = (intervalDays: number): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (intervalDays - 1));
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
};
