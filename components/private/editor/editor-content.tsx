import useEditorStore from "@/stores/editor";
import EditorBlockGroup from "./editor-block-group";
import EditorPreviewGroup from "./editor-preview-group";
import EditorPreviewSuccess from "./editor-preview-success";

const EditorContent = () => {
  const editor = useEditorStore();

  if (editor.preview) {
    return (
      <div className="flex w-full justify-center items-start p-4">
        {editor.view === "blocks" && <EditorPreviewGroup />}
        {editor.view === "success" && <EditorPreviewSuccess />}
      </div>
    );
  }

  return (
    <div className="sm:ml-[56px] flex w-full justify-center items-start mt-12 sm:my-0 sm:py-8 p-4">
      <EditorBlockGroup />
    </div>
  );
};

export default EditorContent;
