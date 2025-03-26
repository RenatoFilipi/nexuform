import { Button } from "@/components/ui/button";
import { FrameIcon, PlusIcon, SettingsIcon } from "lucide-react";
import AddBlock from "../blocks/add-block";
import EditorFormDesign from "./editor-form-design";
import EditorFormSettings from "./editor-form-settings";

const EditorTools = () => {
  return (
    <div className="fixed p-0 sm:p-4 flex justify-center sm:justify-start items-center gap-3 sm:w-[56px] w-full sm:h-full h-12 bg-background sm:flex-col border-b sm:border-none">
      <EditorFormSettings>
        <Button variant={"ghost"} size={"icon"}>
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </EditorFormSettings>
      <EditorFormDesign>
        <Button variant={"ghost"} size={"icon"}>
          <FrameIcon className="w-5 h-5" />
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
