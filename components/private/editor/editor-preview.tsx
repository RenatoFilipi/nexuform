"use client";

import { Badge } from "@/components/ui/badge";
import useEditorStore from "@/stores/editor";
import { TEditorView } from "@/utils/types";
import { useTranslations } from "next-intl";
import EditorPreviewGroup from "./editor-preview-group";
import EditorPreviewSuccess from "./editor-preview-success";

const EditorPreview = () => {
  const t = useTranslations("app");
  const { view, setView } = useEditorStore();

  const views: { name: string; view: TEditorView }[] = [
    { name: t("label_blocks"), view: "blocks" },
    { name: t("label_success"), view: "success" },
  ];

  return (
    <div className="flex w-full flex-1 h-full relative flex-col">
      <div className="flex justify-center items-center pt-4 gap-2 dark:bg-foreground/5 bg-[#F8F8F8]">
        {views.map((x) => {
          return (
            <button
              onClick={() => setView(x.view)}
              key={x.view}
              className={`${
                x.view === view
                  ? "border-foreground/30 text-foreground/100 font-medium bg-background"
                  : "border-transparent text-foreground/70"
              } border py-1 px-2 rounded text-xs gap-1 flex justify-center items-center`}>
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
      <div className="flex w-full h-full justify-center items-start dark:bg-foreground/5 bg-[#F8F8F8]">
        {view === "blocks" && <EditorPreviewGroup />}
        {view === "success" && <EditorPreviewSuccess />}
      </div>
    </div>
  );
};

export default EditorPreview;
