import { formatDistance } from "date-fns";
import { block } from "./types";

export const uuid = () => {
  const uuid = self.crypto.randomUUID();
  return uuid;
};
export const blockName = (type: block) => {
  switch (type) {
    case "short_answer":
      return "Short Answer";
    case "long_answer":
      return "Long Answer";
    case "multiple_choice":
      return "Multiple Choice";
    case "checkboxes":
      return "Checkboxes";
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
