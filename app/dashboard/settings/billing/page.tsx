import BillingWrapper from "@/components/private/settings/billing/billing-wrapper";
import ErrorUI from "@/components/shared/utils/error-ui";
import { stripe } from "@/lib/stripe";
import { IInvoiceSummary } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const Billing = async () => {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("profile_id", userId).single();
  if (subscriptions.error) return <ErrorUI email={email} />;

  const forms = await supabase.from("forms").select("id").eq("owner_id", userId);
  if (forms.error) return <ErrorUI email={email} />;

  const startDate = subscriptions.data.start_date;
  const dueDate = subscriptions.data.due_date;

  const submissionLogs = await supabase
    .from("submission_logs")
    .select("*")
    .eq("profile_id", userId)
    .gte("created_at", startDate)
    .lte("created_at", dueDate);

  if (submissionLogs.error) return <ErrorUI email={email} />;

  let invoicesSummary: IInvoiceSummary[] = [];
  if (profiles.data.stripe_customer_id) {
    let invoices: Stripe.Invoice[] = [];
    const response = await stripe.invoices.list({
      customer: profiles.data.stripe_customer_id,
      limit: 10,
    });
    invoices = response.data;
    invoicesSummary = invoices.map((invoice) => ({
      id: invoice.id,
      status: invoice.status,
      total: invoice.total / 100,
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString("en-US") : null,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
    }));
  }

  return (
    <BillingWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      subscription={subscriptions.data}
      formsCount={forms.data.length}
      submissionLogs={submissionLogs.data}
      invoices={invoicesSummary}
    />
  );
};

export default Billing;

export const metadata: Metadata = {
  title: "Billing",
};
