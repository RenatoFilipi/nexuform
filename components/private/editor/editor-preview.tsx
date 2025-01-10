"use client";

import useEditorStore from "@/stores/editor";
import EditorPreviewGroup from "./editor-preview-group";
import EditorTips from "./editor-tips";

const EditorPreview = () => {
  const { blocks } = useEditorStore();

  if (blocks.length <= 0)
    return (
      <div className="flex justify-center items-center w-full">
        {blocks.length <= 0 && <EditorTips />}
      </div>
    );

  return (
    <div className="flex w-full flex-1 h-full">
      <span className="flex w-full  h-full">
        <EditorPreviewGroup />
      </span>
    </div>
  );
};

export default EditorPreview;
