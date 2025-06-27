import EditorWrapper from "@/components/private2/form/editor/editor-wrapper";
import ErrorUI from "@/components/private2/shared/pages/error-ui";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Editor = async ({ params }: { params: Promise<{ slug: string; id: string }> }) => {
  const locale = await getLocale();
  const { slug, id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const teamMemberProfiles = await supabase.from("team_member_profiles").select("*").eq("profile_id", userId).single();
  if (teamMemberProfiles.error) return <ErrorUI email={email} />;

  const organizations = await supabase.from("organizations").select("*").eq("public_id", slug).single();
  if (organizations.error) return <ErrorUI email={email} />;

  const orgId = organizations.data.id;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscriptions.error) return <ErrorUI email={email} />;

  const forms = await supabase.from("forms").select("*").eq("public_id", id).single();
  if (forms.error) return <ErrorUI email={email} />;

  const themes = await supabase.from("themes").select("*").eq("form_id", forms.data.id).single();
  if (themes.error) return <ErrorUI email={email} />;

  const blocks = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", forms.data.id)
    .order("position", { ascending: true });
  if (blocks.error) return <ErrorUI email={email} />;

  return (
    <EditorWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      teamMemberProfile={teamMemberProfiles.data}
      organization={organizations.data}
      subscription={subscriptions.data}
      form={forms.data}
      theme={themes.data}
      blocks={blocks.data}
    />
  );
};
export default Editor;
