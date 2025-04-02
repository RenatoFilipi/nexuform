import CheckoutSuccess from "@/components/private/checkout/checkout-success";
import ErrorUI from "@/components/private/shared/error-ui";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const CheckoutResult = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  const { session_id } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email ?? "";

  if (!session_id) return <ErrorUI email={email} />;

  const { status, customer_details } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });
  console.log(customer_details);

  if (status === "open" || status === "expired") return redirect("/dashboard/forms");
  return <CheckoutSuccess />;
};

export default CheckoutResult;
