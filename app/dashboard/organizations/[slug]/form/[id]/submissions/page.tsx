import SubmissionsWrapper from "@/components/private/form/submissions/submissions-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { paginationFrom, paginationTo } from "@/utils/constants";
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

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const teamMemberProfiles = await supabase.from("team_member_profiles").select("*").eq("profile_id", userId).single();
  if (teamMemberProfiles.error) return <ErrorUI email={email} />;

  const organizations = await supabase.from("organizations").select("*").eq("public_id", slug).single();
  if (organizations.error) return <ErrorUI email={email} />;

  const orgId = organizations.data.id;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscriptions.error) return <ErrorUI email={email} />;

  const form = await supabase.from("forms").select("*").eq("public_id", id).single();
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

  return (
    <SubmissionsWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      teamMemberProfile={teamMemberProfiles.data}
      organization={organizations.data}
      subscription={subscriptions.data}
      form={form.data}
      blocks={blocks.data}
      submissions={submissions.data}
    />
  );
};
export default Submissions;
