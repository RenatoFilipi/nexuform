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
export type TPlan = "free_trial" | "basic" | "pro" | "business" | "custom" | "starter";
export type TSubscriptionStatus = "active" | "inactive" | "trial";
export type TBillingInterval = "monthly" | "yearly";

// misc
export type TSetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type TAppState = "loading" | "idle" | "success" | "error";
export type TBrand = "logo" | "logo_text" | "top_logo_bottom_text" | "primary_logo_text";
export type CurrencyCode =
  | "USD" // US Dollar
  | "EUR" // Euro
  | "GBP" // British Pound
  | "JPY" // Japanese Yen
  | "AUD" // Australian Dollar
  | "CAD" // Canadian Dollar
  | "CHF" // Swiss Franc
  | "CNY" // Chinese Yuan
  | "BRL" // Brazilian Real
  | "MXN" // Mexican Peso
  | "INR" // Indian Rupee
  | "RUB" // Russian Ruble
  | "ZAR" // South African Rand
  | "SEK" // Swedish Krona
  | "NZD" // New Zealand Dollar
  | "SGD" // Singapore Dollar
  | "HKD" // Hong Kong Dollar
  | "KRW" // South Korean Won
  | "TRY" // Turkish Lira
  | "AED"; // UAE Dirham;

export type TeamMemberRole = "owner" | "admin" | "editor" | "viewer";
export type TeamMemberPermission =
  | "form:create"
  | "form:edit"
  | "form:delete"
  | "form:view"
  | "submission:view"
  | "submission:export"
  | "team:invite"
  | "team:remove"
  | "team:update_role"
  | "billing:manage";

export type TOrganizationStatus = "inactive" | "active";

export type TMetric = "total_views" | "total_submissions" | "completion_rate" | "completion_time";

export type TOrganizationRole = "owner" | "admin" | "staff";

export type TDateRangePreset = "today" | "3days" | "7days" | "30days" | "this_week" | "this_month";
