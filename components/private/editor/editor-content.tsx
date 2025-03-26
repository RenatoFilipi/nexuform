import useEditorStore from "@/stores/editor";
import { useTranslations } from "next-intl";
import EditorBlockGroup from "./editor-block-group";
import EditorPreviewGroup from "./editor-preview-group";
import EditorPreviewSuccess from "./editor-preview-success";

const EditorContent = () => {
  const t = useTranslations("app");
  const editor = useEditorStore();

  const sections = [
    { view: "blocks", label: t("label_blocks") },
    { view: "success", label: t("label_success") },
  ];

  return (
    <div className="flex justify-center items-start w-full h-full flex-1 sm:ml-[56px] py-4 sm:py-8 px-4 sm:px-8 mt-12 sm:mt-0">
      {editor.preview && (
        <div className="flex flex-col gap-4 w-full justify-center items-center">
          {editor.view === "blocks" && <EditorPreviewGroup />}
          {editor.view === "success" && <EditorPreviewSuccess />}
        </div>
      )}
      {!editor.preview && <EditorBlockGroup />}
    </div>
  );
};

export default EditorContent;
