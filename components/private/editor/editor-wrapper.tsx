"use client";

import { Badge } from "@/components/ui/badge";
import useEditorStore from "@/stores/editor";
import useUserStore from "@/stores/user";
import { EBlock, EForm, EProfile, ESubscription, ETheme } from "@/utils/entities";
import { TEditorView } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import EditorPreview from "./editor-preview";
import EditorPreviewGroup from "./editor-preview-group";
import EditorPreviewSuccess from "./editor-preview-success";
import EditorTips from "./editor-tips";
import EditorTools from "./editor-tools";

const EditorWrapper = ({
  form,
  theme,
  blocks,
  profile,
  subscription,
}: {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  profile: EProfile;
  subscription: ESubscription;
}) => {
  const t = useTranslations("app");
  const editorStore = useEditorStore();
  const userStore = useUserStore();
  const [isPending, startTransition] = useTransition();
  const { view, setView } = useEditorStore();

  const views: { name: string; view: TEditorView }[] = [
    { name: t("label_blocks"), view: "blocks" },
    { name: t("label_success"), view: "success" },
  ];

  const query = useQuery({
    queryKey: ["EditorData"],
    queryFn: () => {
      startTransition(() => {
        editorStore.setForm(form);
        editorStore.setTheme(theme);
        editorStore.setBlocks(blocks);
        editorStore.setBlocksReadyOnly(blocks);
        userStore.setProfile(profile);
        userStore.setSubscription(subscription);
        if (subscription.plan !== "pro") {
          editorStore.setTheme({ ...theme, nebulaform_branding: true });
        }
      });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  if (editorStore.preview)
    return (
      <div className="flex flex-col relative w-full overflow-y-auto h-full flex-1 mt-12">
        <div className="flex justify-center items-center w-full px-4 pt-4">
          {views.map((x) => {
            return (
              <button
                onClick={() => setView(x.view)}
                key={x.view}
                className={`${
                  x.view === view
                    ? "border-foreground/30 text-foreground/100 font-medium bg-background"
                    : "border-transparent text-foreground/70"
                } border py-1 px-2 rounded text-xs gap-1 flex justify-center items-center w-full`}>
                {x.name}
                {x.view === "success" && (
                  <Badge variant={"pink"} className="py-0 hidden">
                    Pro
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex w-full h-full justify-center items-start">
          {view === "blocks" && <EditorPreviewGroup />}
          {view === "success" && <EditorPreviewSuccess />}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col relative w-full overflow-y-auto h-full flex-1 mt-12">
      <div className="flex flex-1 overflow-y-auto">
        <div className="sm:w-[380px] fixed top-0 h-screen pt-12 w-full">
          <EditorTools />
        </div>
        <div className="hidden sm:flex flex-1 overflow-y-auto justify-center items-center ml-[380px]">
          {!isPending && editorStore.blocks.length <= 0 && (
            <div className="flex justify-center items-center">
              <EditorTips />
            </div>
          )}
          {!isPending && editorStore.blocks.length >= 1 && <EditorPreview />}
        </div>
      </div>
    </div>
  );
};

export default EditorWrapper;
