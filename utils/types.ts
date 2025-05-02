// form
export type TFormStatus = "inactive" | "draft" | "published";
export type TWidth = "centered" | "full";
export type TBlock =
  | "short_text"
  | "paragraph_text"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown_menu"
  | "number_input"
  | "email_address"
  | "star_rating"
  | "custom_scale"
  | "date_picker";
export type TEditorView = "blocks" | "success";
export type TToolView = "properties" | "styles" | "block" | "settings";
export type TTemplateCategory =
  | "contact"
  | "feedback"
  | "marketing"
  | "customer-success"
  | "events"
  | "sales"
  | "lead-generation"
  | "application"
  | "registration"
  | "survey"
  | "evaluation"
  | "order"
  | "payment"
  | "onboarding"
  | "hr"
  | "healthcare"
  | "education"
  | "real-estate"
  | "application"
  | "job-application";

// submission
export type TSubmissionStatus = "reviewed" | "not_reviewed" | "ignored";

// user
export type TRole = "admin" | "moderator" | "editor" | "contributor" | "member" | "guest" | "none";

// subscriptions
export type TPlan = "free_trial" | "basic" | "pro" | "business" | "custom";
export type TSubscriptionStatus = "active" | "inactive" | "trial";
export type TBillingInterval = "monthly" | "yearly";

// misc
export type TSetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type TAppState = "loading" | "idle" | "success" | "error";
export type TBrand = "logo" | "logo_text" | "top_logo_bottom_text" | "primary_logo_text";
