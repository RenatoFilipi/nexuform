import OrganizationsWrapper from "@/components/private/organizations/organizations-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Organizations = async () => {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const teamMemberProfiles = await supabase.from("team_member_profiles").select("*").eq("profile_id", userId);
  if (teamMemberProfiles.error) return <ErrorUI email={email} />;

  const orgIds = teamMemberProfiles.data.map((x) => x.org_id);

  const organizations = await supabase.from("organizations").select("*").in("id", orgIds);
  if (organizations.error) return <ErrorUI email={email} />;

  if (organizations.data.length < 1) return <ErrorUI email={email} />;

  const subscriptions = await supabase.from("subscriptions").select("*").in("org_id", orgIds);
  if (subscriptions.error) return <ErrorUI email={email} />;

  const invitations = await supabase.from("invitations").select("*").eq("email", email).eq("status", "pending");
  if (invitations.error) return <ErrorUI email={email} />;

  return (
    <OrganizationsWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      organizations={organizations.data}
      subscriptions={subscriptions.data}
      teamMemberProfiles={teamMemberProfiles.data}
      invitations={invitations.data}
    />
  );
};

export default Organizations;
