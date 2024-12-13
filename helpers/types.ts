export type block =
  | "short_text"
  | "paragraph_text"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown_menu"
  | "number_input"
  | "email_address"
  | "star_rating"
  | "custom_scale";
export type setState<T> = React.Dispatch<React.SetStateAction<T>>;
export type appStage =
  | "stage01"
  | "stage02"
  | "stage03"
  | "stage04"
  | "stage05";
export type formStatus = "inactive" | "draft" | "published";
export type appState = "loading" | "idle" | "success" | "error";
export type brand = "logo" | "logo_text" | "top_logo_bottom_text";
export type mode = "preview" | "release";
export type submissionStatus = "reviewed" | "not_reviewed" | "ignored";
export type colorLabel =
  | "Slate"
  | "Gray"
  | "Zinc"
  | "Neutral"
  | "Stone"
  | "Red"
  | "Orange"
  | "Amber"
  | "Yellow"
  | "Lime"
  | "Green"
  | "Emerald"
  | "Teal"
  | "Cyan"
  | "Sky"
  | "Blue"
  | "Indigo"
  | "Violet"
  | "Purple"
  | "Fuchsia"
  | "Pink"
  | "Rose";
