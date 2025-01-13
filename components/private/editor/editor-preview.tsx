"use client";

import EditorPreviewGroup from "./editor-preview-group";

const EditorPreview = () => {
  return (
    <div className="flex w-full flex-1 h-full overflow-y-auto">
      <span className="flex w-full h-full justify-center bg-foreground/5 overflow-y-auto">
        <EditorPreviewGroup />
      </span>
    </div>
  );
};

export default EditorPreview;
