import MembersWrapper from "@/components/private/organization/members/members-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Members = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const organizations = await supabase.from("organizations").select("*").eq("public_id", slug).single();
  if (organizations.error) return <ErrorUI email={email} />;

  const orgId = organizations.data.id;

  const teamMemberProfiles = await supabase.from("team_member_profiles").select("*").eq("org_id", orgId);
  if (teamMemberProfiles.error) return <ErrorUI email={email} />;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscriptions.error) return <ErrorUI email={email} />;

  const teamMemberProfile = teamMemberProfiles.data.find((x) => x.profile_id, userId);
  if (!teamMemberProfile) return <ErrorUI email={email} />;

  return (
    <MembersWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      organization={organizations.data}
      subscription={subscriptions.data}
      teamMemberProfile={teamMemberProfile}
      teamMemberProfiles={teamMemberProfiles.data}
    />
  );
};

export default Members;
