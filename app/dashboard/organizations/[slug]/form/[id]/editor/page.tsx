import { fetchForm } from "@/app/actions/form-actions";
import { fetchOrganization } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscription } from "@/app/actions/subscription-actions";
import { fetchOrgTeamMemberProfile } from "@/app/actions/team-member-profile-actions";
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

  try {
    const profile = await fetchProfile(userId);
    const organization = await fetchOrganization(slug);
    const teamMemberProfile = await fetchOrgTeamMemberProfile(userId, organization.id);
    const subscription = await fetchSubscription(organization.id);
    const form = await fetchForm(id, organization.id);

    const theme = await supabase.from("themes").select("*").eq("form_id", form.id).single();
    if (theme.error) throw new Error("");

    const blocks = await supabase
      .from("blocks")
      .select("*")
      .eq("form_id", form.id)
      .order("position", { ascending: true });
    if (blocks.error) throw new Error("");

    const context = applyContext(teamMemberProfile, organization, subscription);

    return (
      <EditorWrapper
        locale={locale}
        email={email}
        profile={profile}
        teamMemberProfile={teamMemberProfile}
        organization={organization}
        subscription={subscription}
        form={form}
        theme={theme.data}
        blocks={blocks.data}
        context={context}
      />
    );
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};
export default Editor;
