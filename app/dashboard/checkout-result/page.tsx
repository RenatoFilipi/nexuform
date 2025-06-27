import CheckoutSuccess from "@/components/private2/checkout/checkout-success";
import ErrorUI from "@/components/private2/shared/pages/error-ui";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

const CheckoutResult = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;

  const { session_id } = await searchParams;
  if (!session_id) return <ErrorUI email={email} />;

  const { status } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open" || status === "expired") return redirect("/dashboard/organizations");

  return <CheckoutSuccess />;
};

export default CheckoutResult;

export const metadata: Metadata = {
  title: "Checkout result",
};
