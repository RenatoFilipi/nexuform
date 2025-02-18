"use client";

import EditorPreviewGroup from "./editor-preview-group";

const EditorPreview = () => {
  return (
    <div className="flex w-full flex-1 h-full relative">
      <div className="flex w-full h-full justify-center items-start dark:bg-[#2f3235] bg-[#F8F8F8]">
        <EditorPreviewGroup />
      </div>
    </div>
  );
};

export default EditorPreview;
