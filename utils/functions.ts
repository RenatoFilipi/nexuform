import { formatDistance } from "date-fns";
import { customAlphabet } from "nanoid";
import { redirect } from "next/navigation";
import { TBlock } from "./types";

export const uuid = () => {
  const uuid = self.crypto.randomUUID();
  return uuid;
};
export const nanoid = (length: number = 12) => {
  const nnid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", length);
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
