import { fetchProfile } from "@/app/actions/profile-actions";
import GeneralWrapper from "@/components/private/account/general-wrapper";
import PasswordWrapper from "@/components/private/account/password-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Password = async () => {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  try {
    const profile = await fetchProfile(userId);
    return <PasswordWrapper email={email} locale={locale} profile={profile} />;
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};

export default Password;
