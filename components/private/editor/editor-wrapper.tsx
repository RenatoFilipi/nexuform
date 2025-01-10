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
    <div className="h-screen flex flex-col relative w-full overflow-y-auto">
      <EditorNav />
      <div className="flex flex-1 relative overflow-y-auto">
        <EditorTools />
        <div className="flex flex-1 overflow-y-auto justify-center items-center">
          <EditorPreview />
        </div>
      </div>
    </div>
  );
};

export default EditorWrapper;
