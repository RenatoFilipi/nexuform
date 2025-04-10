import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import AddBlock from "../../blocks/add-block";
import WipUI from "../../shared/wip-ui";

const EditorContent = () => {
  return (
    <div className="w-full sm:mr-[400px] flex justify-center items-center flex-col gap-2 p-8">
      <EditorCanvas />
    </div>
  );
};

const EditorCanvas = () => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const empty = editor.blocks.length <= 0;

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-8 rounded-lg border-2 border-dashed bg-muted/5">
        <div className="flex flex-col items-center max-w-md text-center space-y-6">
          <div className="rounded-full bg-primary/5 p-3">
            <PlusIcon className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{t("label_start_form")}</h3>
            <p className="text-sm text-muted-foreground">{t("desc_start_form")}</p>
          </div>
          <AddBlock>
            <Button size={"sm"} variant={"secondary"}>
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("label_first_block")}
            </Button>
          </AddBlock>
        </div>
      </div>
    );
  }

  return (
    <div className="border w-full h-full flex justify-center items-center sm:w-[700px]">
      <WipUI context="canvas" />
    </div>
  );
};

export default EditorContent;
