import useEditorStore from "@/stores/editor";
import EditorBlockGroup from "./editor-block-group";
import EditorPreviewGroup from "./editor-preview-group";
import EditorPreviewSuccess from "./editor-preview-success";

const EditorContent = () => {
  const editor = useEditorStore();

  return (
    <div
      className={`${
        editor.preview ? "sm:mt-0" : "sm:ml-[56px] sm:mt-0 mt-12"
      } flex justify-center items-center w-full h-full flex-1 py-4 sm:py-8 px-4 sm:px-8`}>
      {editor.preview && (
        <div className="flex flex-col gap-4 w-full justify-center items-center h-full">
          {editor.view === "blocks" && (
            <div className="flex justify-center items-start flex-1 w-full h-full">
              <EditorPreviewGroup />
            </div>
          )}
          {editor.view === "success" && (
            <div className="w-full h-full flex-1 flex justify-center items-center">
              <EditorPreviewSuccess />
            </div>
          )}
        </div>
      )}
      {!editor.preview && <EditorBlockGroup />}
    </div>
  );
};

export default EditorContent;
