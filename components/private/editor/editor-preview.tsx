"use client";

import EditorPreviewGroup from "./editor-preview-group";

const EditorPreview = () => {
  return (
    <div className="flex w-full flex-1 h-full">
      <div className="flex w-full h-full justify-center items-start bg-[#F8F8F8] dark:bg-background">
        <EditorPreviewGroup />
      </div>
    </div>
  );
};

export default EditorPreview;
