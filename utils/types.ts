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
export type TsubmissionStatus = "reviewed" | "not_reviewed" | "ignored";
export type TColors =
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
export type TPlan = {
  name: string;
  price: number;
  features: string[];
  highlighted: boolean;
  type: "free_trial" | "basic" | "pro";
};
export type TWidth = "centered" | "full";
