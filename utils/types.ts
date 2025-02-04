// Tipo para os blocos de formulário
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

// Tipo genérico para setState do React
export type TSetState<T> = React.Dispatch<React.SetStateAction<T>>;

// Status de um formulário
export type TFormStatus = "inactive" | "draft" | "published";

// Estado global da aplicação
export type TAppState = "loading" | "idle" | "success" | "error";

// Tipos de branding disponíveis
export type TBrand = "logo" | "logo_text" | "top_logo_bottom_text";

// Status de uma submissão
export type TSubmissionStatus = "reviewed" | "not_reviewed" | "ignored";

// Cores suportadas
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

// Definição de um plano de assinatura
export type TPlan = {
  name: string;
  price: number;
  features: string[];
  highlighted: boolean;
  type: "free_trial" | "basic" | "pro";
};

// Largura do formulário
export type TWidth = "centered" | "full";

// Papéis de usuário dentro do sistema
export type TRole =
  | "admin"
  | "moderator"
  | "editor"
  | "contributor"
  | "member"
  | "guest"
  | "none";

// Status da assinatura do usuário
export type TSubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing";

// Intervalo de cobrança de um plano
export type TBillingInterval = "monthly" | "yearly";

// Status de uma fatura
export type TInvoiceStatus = "paid" | "pending" | "failed";
