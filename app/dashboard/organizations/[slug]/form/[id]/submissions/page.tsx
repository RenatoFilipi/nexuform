import { fetchForm } from "@/app/actions/form-actions";
import { fetchOrganization } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscription } from "@/app/actions/subscription-actions";
import { fetchOrgTeamMemberProfile } from "@/app/actions/team-member-profile-actions";
import SubmissionsWrapper from "@/components/private/form/submissions/submissions-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { paginationFrom, paginationTo } from "@/utils/constants";
import { applyContext } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Submissions = async ({ params }: { params: Promise<{ slug: string; id: string }> }) => {
  const { slug, id } = await params;
  const locale = await getLocale();
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

    const blocks = await supabase
      .from("blocks")
      .select("*")
      .eq("form_id", form.id)
      .order("position", { ascending: true });
    if (blocks.error) return <ErrorUI email={email} />;

    const submissions = await supabase
      .from("submissions")
      .select("*")
      .range(paginationFrom, paginationTo)
      .eq("form_id", form.id)
      .order("created_at", { ascending: false });
    if (submissions.error) return <ErrorUI email={email} />;

    const context = applyContext(teamMemberProfile, organization, subscription);

    return (
      <SubmissionsWrapper
        locale={locale}
        email={email}
        profile={profile}
        teamMemberProfile={teamMemberProfile}
        organization={organization}
        subscription={subscription}
        form={form}
        blocks={blocks.data}
        submissions={submissions.data}
        context={context}
      />
    );
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};
export default Submissions;
