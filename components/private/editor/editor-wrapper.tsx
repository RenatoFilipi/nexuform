"use client";

import useEditorStore from "@/stores/editor";
import { EBlock, EForm, ETheme } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import EditorNav from "./editor-nav";
import EditorPreview from "./editor-preview";
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
  const { setForm, setTheme, setBlocks } = useEditorStore();
  useQuery({
    queryKey: ["EditorData"],
    queryFn: () => {
      setForm(form);
      setTheme(theme);
      setBlocks(blocks);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col h-screen flex-1 gap-4">
      <EditorNav />
      <div className="mt-14 flex flex-1 relative">
        <EditorTools />
        <EditorPreview />
      </div>
    </div>
  );
};

export default EditorWrapper;
