import { fetchInvitations } from "@/app/actions/invitation-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import InvitationsWrapper from "@/components/private/invitations/invitations-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Invitations = async () => {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  try {
    const profile = await fetchProfile(userId);
    const invitations = await fetchInvitations(email, "pending");

    return <InvitationsWrapper locale={locale} email={email} profile={profile} invitations={invitations} />;
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};

export default Invitations;
