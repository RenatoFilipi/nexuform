export type block =
  | "short_answer"
  | "long_answer"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "number"
  | "email"
  | "rating"
  | "scale";
export type setState<T> = React.Dispatch<React.SetStateAction<T>>;
export type stage = "stage01" | "stage02" | "stage03" | "stage04" | "stage05";
export type formStatus = "inactive" | "draft" | "published";
export type dashboardFormsState = "loading" | "no_form" | "has_form" | "error";
export type dashboardFormState =
  | "loading"
  | "no_submissions"
  | "has_submissions"
  | "error";
export type dashboardEditorState =
  | "loading"
  | "no_block"
  | "has_block"
  | "error";
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
