import EditorWrapper from "@/components/private/editor/editor-wrapper";
import SubscriptionUI from "@/components/private/shared/subscription/subscription-ui";
import ErrorUI from "@/components/shared/utils/error-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Editor = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const locale = await getLocale();
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const organizations = await supabase.from("organizations").select("*").eq("owner_id", userId);
  if (organizations.error) return <ErrorUI email={email} />;

  const orgId = organizations.data[0].id;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscriptions.error) return <ErrorUI email={email} />;

  const active = isSubscriptionActive(subscriptions.data);
  if (!active) {
    return <SubscriptionUI email={email} locale={locale} profile={profiles.data} subscription={subscriptions.data} />;
  }

  const forms = await supabase.from("forms").select("*").eq("owner_id", userId).eq("id", slug).single();
  if (forms.error) return <ErrorUI email={email} />;
  if (forms.data.owner_id !== userId) return redirect("/dashboard/forms");

  const themes = await supabase.from("themes").select("*").eq("form_id", slug).single();
  if (themes.error) return <ErrorUI email={email} />;

  const blocks = await supabase.from("blocks").select("*").eq("form_id", slug).order("position", { ascending: true });
  if (blocks.error) return <ErrorUI email={email} />;

  return (
    <EditorWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      form={forms.data}
      theme={themes.data}
      blocks={blocks.data}
      subscription={subscriptions.data}
      organizations={organizations.data}
    />
  );
};

export default Editor;

export const metadata: Metadata = {
  title: "Editor",
};
