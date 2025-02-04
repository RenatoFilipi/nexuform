"use client";

import useEditorStore from "@/stores/editor";
import { EBlock, EForm, ETheme } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTransition } from "react";
import EditorPreview from "./editor-preview";
import EditorPreviewGroup from "./editor-preview-group";
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
    setBlocksReadyOnly,
    blocks: localBlocks,
    preview,
  } = useEditorStore();
  const [isPending, startTransition] = useTransition();

  const query = useQuery({
    queryKey: ["EditorData"],
    queryFn: () => {
      startTransition(() => {
        setForm(form);
        setTheme(theme);
        setBlocks(blocks);
        setBlocksReadyOnly(blocks);
      });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  if (preview)
    return (
      <div className="flex flex-col relative w-full overflow-y-auto h-full flex-1 mt-14">
        <div className="flex w-full h-full justify-center items-start bg-foreground/5">
          <EditorPreviewGroup />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col relative w-full overflow-y-auto h-full flex-1 mt-14">
      <div className="flex flex-1 overflow-y-auto">
        <div className="sm:w-[380px] fixed top-0 h-screen pt-14 w-full">
          <EditorTools />
        </div>
        <div className="hidden sm:flex flex-1 overflow-y-auto justify-center items-center ml-[380px]">
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
