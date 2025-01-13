import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { EBlock } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { appState } from "@/utils/types";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const EditorNav = ({ initialBlocks }: { initialBlocks: EBlock[] }) => {
  const { form, theme, blocks } = useEditorStore();
  const supabase = createClient();
  const router = useRouter();
  const [appState, setAppState] = useState<appState>("idle");

  const onSave = async () => {
    try {
      setAppState("loading");

      await onSaveForm();
      await onSaveTheme();
      await onSaveBlocks();

      toast.success("Form Updated.");
      router.push(`/dashboard/forms/${form.id}`);
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong.");
    } finally {
      setAppState("idle");
    }
  };
  const onSaveForm = async () => {
    try {
      const { error } = await supabase
        .from("forms")
        .update({
          name: form.name,
          description: form.description,
          status: form.status,
          submit_text: form.submit_text,
        })
        .eq("id", form.id);

      if (error) {
        console.error("Error updating form:", error);
        throw new Error("Failed to update form.");
      }
    } catch (error) {
      console.error("Unexpected error in onSaveForm:", error);
      throw error;
    }
  };
  const onSaveTheme = async () => {
    try {
      const { error } = await supabase
        .from("themes")
        .update({
          primary_color: theme.primary_color,
          numeric_blocks: theme.numeric_blocks,
        })
        .eq("id", theme.id);

      if (error) {
        console.error("Error updating theme:", error);
        throw new Error("Failed to update theme.");
      }
    } catch (error) {
      console.error("Unexpected error in onSaveTheme:", error);
      throw error;
    }
  };
  const onSaveBlocks = async () => {
    try {
      const elementsBefore = initialBlocks;
      const elementsAfter = blocks;
      let inBoth = [];
      let inEither = [];
      let newElements = [];
      let removedElements = [];
      let elementsToUpsert = [];
      let elementsToDelete = [];

      const beforeIds = new Set(elementsBefore.map((x) => x.id));
      const afterIds = new Set(elementsAfter.map((x) => x.id));

      inBoth = [
        ...elementsBefore.filter((x) => afterIds.has(x.id)),
        ...elementsAfter.filter((x) => beforeIds.has(x.id)),
      ];
      inEither = [
        ...elementsBefore.filter((x) => !afterIds.has(x.id)),
        ...elementsAfter.filter((x) => !beforeIds.has(x.id)),
      ];

      inBoth = inBoth.filter(
        (item, index, self) => self.findIndex((x) => x.id === item.id) === index
      );
      inEither = inEither.filter(
        (item, index, self) => self.findIndex((x) => x.id === item.id) === index
      );

      newElements = inEither.filter((x) => afterIds.has(x.id));
      removedElements = inEither.filter((x) => beforeIds.has(x.id));

      elementsToUpsert = inBoth.map((before) => {
        const after = elementsAfter.find((x) => x.id === before.id);
        if (after && JSON.stringify(before) !== JSON.stringify(after)) {
          return { ...before, ...after };
        }
        return before;
      });

      elementsToUpsert = [...elementsToUpsert, ...newElements];

      elementsToDelete = [...removedElements];

      const { error: upsertError } = await supabase
        .from("blocks")
        .upsert(elementsToUpsert);
      if (upsertError) {
        console.error("Error upserting blocks:", upsertError);
        throw new Error("Failed to upsert blocks.");
      }

      const deletePromises = elementsToDelete.map(
        async (x) => await supabase.from("blocks").delete().eq("id", x.id)
      );
      const deleteResults = await Promise.all(deletePromises);

      deleteResults.forEach(({ error }, index) => {
        if (error) {
          console.error(
            `Error deleting block with id ${elementsToDelete[index].id}:`,
            error
          );
          throw new Error("Failed to delete blocks.");
        }
      });
    } catch (error) {
      console.error("Unexpected error in onSaveBlocks:", error);
      throw error;
    }
  };

  return (
    <div className="h-14 flex justify-between items-center w-full bg-background border-y border-t-foreground/5 sm:px-6 px-2 z-20">
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
          onClick={onSave}
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
