import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { TEditorView } from "@/utils/types";
import { useTranslations } from "next-intl";
import EditorPreviewGroup from "../editor-preview-group";
import EditorPreviewSuccess from "../editor-preview-success";
import EditorBlockGroup from "./editor-block-group";

const EditorPreview = () => {
  const t = useTranslations("app");
  const editor = useEditorStore();

  const sections = [
    { view: "blocks", label: t("label_blocks") },
    { view: "success", label: t("label_success") },
  ];

  return (
    <div className="flex justify-center items-start w-full h-full flex-1 sm:ml-[56px] py-4 sm:py-8 px-4 sm:px-8">
      {editor.preview && (
        <div className="flex flex-col gap-4 w-full justify-center items-center">
          <div className="flex justify-center items-center w-full gap-2">
            {sections.map((sec) => {
              return (
                <Button
                  onClick={() => editor.setView(sec.view as TEditorView)}
                  key={sec.view}
                  variant={"outline"}
                  size={"xs"}
                  className={`${editor.view === sec.view ? "bg-foreground/5" : ""}`}>
                  {sec.label}
                </Button>
              );
            })}
          </div>
          {editor.view === "blocks" && <EditorPreviewGroup />}
          {editor.view === "success" && <EditorPreviewSuccess />}
        </div>
      )}
      {!editor.preview && <EditorBlockGroup />}
    </div>
  );
};

export default EditorPreview;
