"use client";

import useEditorStore from "@/stores/editor";
import { EBlock, EForm, ETheme } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTransition } from "react";
import EditorNav from "./editor-nav";
import EditorPreview from "./editor-preview";
import EditorTips from "./editor-tips";
import EditorTools from "./editor-tools";

const EditorWrapper = ({
  form,
  theme,
  blocks,
}: {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
}) => {
  const {
    setForm,
    setTheme,
    setBlocks,
    blocks: localBlocks,
  } = useEditorStore();
  const [isPending, startTransition] = useTransition();

  useQuery({
    queryKey: ["EditorData"],
    queryFn: () => {
      startTransition(() => {
        setForm(form);
        setTheme(theme);
        setBlocks(blocks);
      });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="h-screen flex flex-col relative w-full overflow-y-auto">
      <EditorNav initialBlocks={blocks} />
      <div className="flex flex-1 relative overflow-y-auto">
        <EditorTools />
        <div className="flex flex-1 overflow-y-auto justify-center items-center">
          {!isPending && localBlocks.length <= 0 && (
            <div className="flex justify-center items-center">
              <EditorTips />
            </div>
          )}
          {!isPending && localBlocks.length >= 1 && <EditorPreview />}
        </div>
      </div>
    </div>
  );
};

export default EditorWrapper;
