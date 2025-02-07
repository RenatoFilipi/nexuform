export type TBlock =
  | "short_text"
  | "paragraph_text"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown_menu"
  | "number_input"
  | "email_address"
  | "star_rating"
  | "custom_scale";
export type TSetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type TFormStatus = "inactive" | "draft" | "published";
export type TAppState = "loading" | "idle" | "success" | "error";
export type TBrand = "logo" | "logo_text" | "top_logo_bottom_text";
export type TSubmissionStatus = "reviewed" | "not_reviewed" | "ignored";
export type TColor =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";
export type TPlan = "free_trial" | "basic" | "pro" | "business" | "custom";
export type TWidth = "centered" | "full";
export type TRole =
  | "admin"
  | "moderator"
  | "editor"
  | "contributor"
  | "member"
  | "guest"
  | "none";
export type TSubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing";

export type TBillingInterval = "monthly" | "yearly";
export type TInvoiceStatus = "paid" | "pending" | "failed";
export type TFilterSort = "ascending" | "descending";
export type TFormStatusExtended = "all" | TFormStatus;
