import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { createClient } from "@/utils/supabase/client";
import { appState } from "@/utils/types";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const EditorNav = () => {
  const { form, theme, blocks } = useEditorStore();
  const supabase = createClient();
  const router = useRouter();
  const [appState, setAppState] = useState<appState>("idle");
  console.log(blocks);

  const onSaveForm = async () => {
    setAppState("loading");
    const formResult = await supabase
      .from("forms")
      .update({
        name: form.name,
        description: form.description,
        status: form.status,
        submit_text: form.submit_text,
      })
      .eq("id", form.id);

    if (formResult.error) {
      toast.error("Error on updating the form.");
      setAppState("idle");
      return;
    }
    const themeResult = await supabase
      .from("themes")
      .update({
        primary_color: theme.primary_color,
        numeric_blocks: theme.numeric_blocks,
      })
      .eq("id", theme.id);

    if (themeResult.error) {
      toast.error("Error on updating the theme.");
      setAppState("idle");
      return;
    }

    const blocksResult = await supabase.from("blocks").upsert(blocks);

    if (blocksResult.error) {
      toast.error("Error on updating the blocks.");
      console.log(blocksResult.error);
      setAppState("idle");
      return;
    }

    toast.success("Form Updated.");
    router.push(`/dashboard/forms/${form.id}`);
  };

  return (
    <div className="static h-14 flex justify-between items-center w-full top-0 bg-background border-y border-t-foreground/5 sm:px-6 px-2 z-20">
      <div className="flex justify-center items-center gap-2">
        <Button variant={"ghost"} size={"icon"} className="h-9 w-9" asChild>
          <Link href={"/dashboard/forms"}>
            <Brand type="logo" className="h-5 fill-foreground" />
          </Link>
        </Button>
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm font-medium">{form.name}</span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button
          size={"sm"}
          variant={"default"}
          onClick={onSaveForm}
          disabled={appState === "loading"}>
          {appState === "loading" ? (
            <LoaderIcon className="animate-spin w-4 h-4" />
          ) : (
            "Save Form"
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditorNav;
