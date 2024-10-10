export type stage = "stage01" | "stage02" | "stage03" | "stage04" | "stage05";
export type setState<T> = React.Dispatch<React.SetStateAction<T>>;
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
