import EditorWrapper from "@/components/private/form/editor/editor-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { applyContext } from "@/utils/functions";
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

  const profile = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profile.error) return <ErrorUI email={email} />;

  const organization = await supabase.from("organizations").select("*").eq("public_id", slug).single();
  if (organization.error) return <ErrorUI email={email} />;

  const orgId = organization.data.id;

  const teamMemberProfile = await supabase
    .from("team_member_profiles")
    .select("*")
    .eq("profile_id", userId)
    .eq("org_id", orgId)
    .single();
  if (teamMemberProfile.error) return <ErrorUI email={email} />;

  const subscription = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscription.error) return <ErrorUI email={email} />;

  const form = await supabase.from("forms").select("*").eq("public_id", id).single();
  if (form.error) return <ErrorUI email={email} />;

  const theme = await supabase.from("themes").select("*").eq("form_id", form.data.id).single();
  if (theme.error) return <ErrorUI email={email} />;

  const blocks = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", form.data.id)
    .order("position", { ascending: true });
  if (blocks.error) return <ErrorUI email={email} />;

  const context = applyContext(teamMemberProfile.data, organization.data);

  return (
    <EditorWrapper
      locale={locale}
      email={email}
      profile={profile.data}
      teamMemberProfile={teamMemberProfile.data}
      organization={organization.data}
      subscription={subscription.data}
      form={form.data}
      theme={theme.data}
      blocks={blocks.data}
      context={context}
    />
  );
};
export default Editor;
