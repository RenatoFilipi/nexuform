import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import { FrameIcon, PlusIcon, Settings2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import AddBlock from "../blocks/add-block";
import Block from "../blocks/block";
import EditorFormDesign from "./editor-form-design";
import EditorFormSettings from "./editor-form-settings";

const EditorTools = () => {
  const t = useTranslations("app");
  const { form, blocks } = useEditorStore();

  return (
    <div className="flex justify-start flex-col items-center h-full border-r border-t p-4 gap-3 bg-background">
      <div className="w-full flex flex-col gap-3">
        <div className="flex justify-center items-center w-full gap-4">
          <EditorFormSettings>
            <Button variant={"outline"} size={"sm"} className="w-full">
              <Settings2Icon className="w-4 h-4 mr-2" />
              {t("label_settings")}
            </Button>
          </EditorFormSettings>
          <EditorFormDesign>
            <Button variant={"outline"} size={"sm"} className="w-full">
              <FrameIcon className="w-4 h-4 mr-2" />
              {t("label_design")}
            </Button>
          </EditorFormDesign>
        </div>
      </div>
      <div className="flex w-full h-full justify-center items-start overflow-y-auto">
        <div className="w-full flex flex-col gap-2 overflow-y-auto">
          {blocks.map((block, index) => {
            return <Block key={index} block={block} />;
          })}
          <AddBlock formId={form.id}>
            <Button size={"sm"} className="w-full" variant={"ghost"}>
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("label_new_block")}
            </Button>
          </AddBlock>
        </div>
      </div>
    </div>
  );
};

export default EditorTools;
