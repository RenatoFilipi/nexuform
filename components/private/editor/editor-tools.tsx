import { Button } from "@/components/ui/button";
import { PaintbrushIcon, PlusIcon, SettingsIcon } from "lucide-react";
import AddBlock from "../blocks/add-block";
import EditorFormDesign from "./editor-form-design";
import EditorFormSettings from "./editor-form-settings";

const EditorTools = () => {
  return (
    <div className="fixed py-2 flex flex-col justify-start items-center gap-3 sm:w-[56px] h-full bg-background">
      <EditorFormSettings>
        <Button variant={"ghost"} size={"icon"}>
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </EditorFormSettings>
      <EditorFormDesign>
        <Button variant={"ghost"} size={"icon"}>
          <PaintbrushIcon className="w-5 h-5" />
        </Button>
      </EditorFormDesign>
      <AddBlock>
        <Button variant={"ghost"} size={"icon"}>
          <PlusIcon className="w-5 h-5" />
        </Button>
      </AddBlock>
    </div>
  );
};

export default EditorTools;
