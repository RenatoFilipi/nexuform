import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import {
  ListOrderedIcon,
  PaintbrushIcon,
  PlusIcon,
  Settings2Icon,
} from "lucide-react";
import AddBlock from "../blocks/add-block";
import FormDesign from "../forms/form-design";
import FormReorder from "../forms/form-reorder";
import FormSettings from "../forms/form-settings";

const EditorTools = () => {
  const { form } = useEditorStore();

  return (
    <div className="flex justify-center items-start fixed border-r h-full sm:w-[360px] p-4 gap-6">
      <div className="w-full flex flex-col gap-3">
        <AddBlock formId={form.id}>
          <Button size={"sm"} className=" w-full">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Block
          </Button>
        </AddBlock>
        <div className="flex justify-center items-center w-full gap-4">
          <FormDesign>
            <Button variant={"outline"} size={"sm"} className="flex-1">
              <PaintbrushIcon className="w-4 h-4 mr-2" />
              Design
            </Button>
          </FormDesign>
          <FormSettings>
            <Button variant={"outline"} size={"sm"} className="flex-1">
              <Settings2Icon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </FormSettings>
          <FormReorder>
            <Button variant={"outline"} size={"sm"} className="flex-1">
              <ListOrderedIcon className="w-4 h-4 mr-2" />
              Reorder
            </Button>
          </FormReorder>
        </div>
      </div>
    </div>
  );
};

export default EditorTools;
