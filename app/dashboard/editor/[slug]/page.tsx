import EditorWrapper from "@/components/private/editor/editor-wrapper";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Editor = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("login");

  const { data: form } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .eq("id", slug)
    .single();

  if (form === null) return redirect("/dashboard/forms");

  const { data: theme } = await supabase
    .from("themes")
    .select("*")
    .eq("form_id", slug)
    .single();

  if (theme === null) return redirect("/dashboard/forms");

  const { data: blocks } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", slug)
    .order("position", { ascending: true });

  return <EditorWrapper form={form} theme={theme} blocks={blocks ?? []} />;
};

export default Editor;
