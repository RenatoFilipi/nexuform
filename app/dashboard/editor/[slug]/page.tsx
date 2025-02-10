import EditorWrapper from "@/components/private/editor/editor-wrapper";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Editor = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    return <ErrorUI />;
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", data.user.id)
    .single();

  if (subscriptionError) {
    return <ErrorUI />;
  }

  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .eq("id", slug)
    .single();

  if (formError) return <ErrorUI />;

  if (form.owner_id !== data.user.id) return redirect("/dashboard/forms");

  const { data: theme, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .eq("form_id", slug)
    .single();

  if (themeError) return <ErrorUI />;

  const { data: blocks, error: blocksError } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", slug)
    .order("position", { ascending: true });

  if (blocksError) return <ErrorUI />;

  return (
    <EditorWrapper
      form={form}
      theme={theme}
      blocks={blocks}
      profile={profile}
      subscription={subscription}
    />
  );
};

const ErrorUI = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="">Something went wrong</span>
      </div>
    </div>
  );
};

export default Editor;
