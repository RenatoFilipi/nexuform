import EditorWrapper from "@/components/private/editor/editor-wrapper";
import ErrorUI from "@/components/private/shared/error-ui";
import SubscriptionUI from "@/components/private/shared/subscription-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Editor = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email ?? "";

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) return <ErrorUI email={email} />;

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", data.user.id)
    .single();

  if (subscriptionError) return <ErrorUI email={email} />;

  const active = isSubscriptionActive(subscription);
  if (!active) return <SubscriptionUI email={email} />;

  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .eq("id", slug)
    .single();

  if (formError) return <ErrorUI email={email} />;

  if (form.owner_id !== data.user.id) return redirect("/dashboard/forms");

  const { data: theme, error: themeError } = await supabase.from("themes").select("*").eq("form_id", slug).single();

  if (themeError) return <ErrorUI email={email} />;

  const { data: blocks, error: blocksError } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", slug)
    .order("position", { ascending: true });

  if (blocksError) return <ErrorUI email={email} />;

  const locale = await getLocale();

  return (
    <EditorWrapper
      email={email}
      locale={locale}
      form={form}
      theme={theme}
      blocks={blocks}
      profile={profile}
      subscription={subscription}
    />
  );
};

export default Editor;
