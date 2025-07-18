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

  const form = await supabase.from("forms").select("*").eq("public_id", id).eq("org_id", orgId).single();
  if (form.error) return <ErrorUI email={email} />;

  const blocks = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", form.data.id)
    .order("position", { ascending: true });
  if (blocks.error) return <ErrorUI email={email} />;

  const submissions = await supabase
    .from("submissions")
    .select("*")
    .range(paginationFrom, paginationTo)
    .eq("form_id", form.data.id)
    .order("created_at", { ascending: false });
  if (submissions.error) return <ErrorUI email={email} />;

  const context = applyContext(teamMemberProfile.data, organization.data, subscription.data);

  return (
    <SubmissionsWrapper
      locale={locale}
      email={email}
      profile={profile.data}
      teamMemberProfile={teamMemberProfile.data}
      organization={organization.data}
      subscription={subscription.data}
      form={form.data}
      blocks={blocks.data}
      submissions={submissions.data}
      context={context}
    />
  );
};
export default Submissions;
