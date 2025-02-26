import { differenceInDays, formatDistance } from "date-fns";
import { customAlphabet } from "nanoid";
import { redirect } from "next/navigation";
import { day, planSettings } from "./constants";
import { EIntegration, ESubscription } from "./entities";
import { basicSubmissions, freeTrialSubmissions, proSubmissions } from "./envs";
import { TBlock, TIntegrationCategory, TIntegrations, TPlan } from "./types";

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
    from: new Date(Date.now() - days * 24 * day).toISOString(),
    to: now,
  };
};
export const getDaysDifference = (startDate: Date, endDate: Date) => {
  return differenceInDays(endDate, startDate);
};
export const getCurrentPlan = (plan: TPlan) => {
  switch (plan) {
    case "free_trial": {
      return planSettings.freeTrial;
    }
    case "basic": {
      return planSettings.basic;
    }
    case "pro": {
      return planSettings.pro;
    }
    default:
      return planSettings.freeTrial;
  }
};
export const isSubscriptionActive = (subscription: ESubscription) => {
  const now = new Date();
  const dueDate = new Date(subscription.due_date);
  return subscription.status === "active" && dueDate >= now;
};
export const getIntegrationName = (type: TIntegrations) => {
  const integrationNames: Record<TIntegrations, string> = {
    google_sheets: "Google Sheets",
    zapier: "Zapier",
    slack: "Slack",
    google_drive: "Google Drive",
    notion: "Notion",
    trello: "Trello",
    airtable: "Airtable",
    webhooks: "Webhooks",
    discord: "Discord",
    mailchimp: "Mailchimp",
    hubspot: "HubSpot",
    salesforce: "Salesforce",
    sendgrid: "SendGrid",
    twilio: "Twilio",
  };

  return integrationNames[type] || "Unknown Integration";
};
export const getIntegrationCategory = (type: TIntegrationCategory) => {
  const integrationCategory: Record<TIntegrationCategory, string> = {
    automation: "Automation",
    communication: "Communication",
    crm: "CRM",
    database: "Database",
    email_marketing: "Email Marketing",
    notifications: "Notifications",
    storage: "Storage",
  };

  return integrationCategory[type] || "Unknown Category";
};
export const isSubmissionsLimitReached = (subscription: ESubscription, submissions: number) => {
  switch (subscription.plan) {
    case "free_trial":
      return submissions > freeTrialSubmissions;
    case "basic":
      return submissions > basicSubmissions;
    case "pro":
      return submissions > proSubmissions;
    default:
      return true;
  }
};
export const googleSheetIntegration = (config: EIntegration) => {};
