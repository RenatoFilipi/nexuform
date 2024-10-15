export type block =
  | "short_answer"
  | "long_answer"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "multi_select"
  | "number"
  | "email"
  | "rating";
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
