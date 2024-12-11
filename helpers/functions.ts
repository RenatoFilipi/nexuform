import { formatDistance } from "date-fns";
import { customAlphabet } from "nanoid";
import { block } from "./types";

export const uuid = () => {
  const uuid = self.crypto.randomUUID();
  return uuid;
};
export const nanoid = (length: number = 12) => {
  const nnid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", length);
  return nnid();
};
export const blockName = (type: block) => {
  switch (type) {
    case "short_answer":
      return "Short Answer";
    case "long_answer":
      return "Long Answer";
    case "radio_button":
      return "Radio Button";
    case "checkbox":
      return "checkbox";
    case "dropdown":
      return "Dropdown";
    case "number":
      return "Number";
    case "email":
      return "Email";
    case "rating":
      return "Rating";
    case "scale":
      return "Scale";
  }
};
export const formatDateRelativeToNow = (isoDate: string) => {
  const date = new Date(isoDate);
  return formatDistance(date, new Date(), {
    addSuffix: true,
  });
};
