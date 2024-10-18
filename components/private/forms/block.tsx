import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { block } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";
import {
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  HashIcon,
  MailIcon,
  MinusIcon,
  ScaleIcon,
  SettingsIcon,
  StarIcon,
  TextIcon,
  TrashIcon,
} from "lucide-react";
import BlockSettings from "./block-settings";

const blockIcons: { [key in block]: JSX.Element } = {
  short_answer: <MinusIcon className="w-5 h-5" />,
  long_answer: <TextIcon className="w-5 h-5" />,
  multiple_choice: <CheckSquareIcon className="w-5 h-5" />,
  checkboxes: <CheckCircleIcon className="w-5 h-5" />,
  dropdown: <ChevronDownIcon className="w-5 h-5" />,
  number: <HashIcon className="w-5 h-5" />,
  email: <MailIcon className="w-5 h-5" />,
  rating: <StarIcon className="w-5 h-5" />,
  scale: <ScaleIcon className="w-5 h-5" />,
};

const Block = (block: BlockProps) => {
  const { removeBlock } = useEditorStore();

  return (
    <Card className="flex justify-between items-center w-full border py-2 px-2">
      <div className="flex justify-center items-center gap-3">
        {blockIcons[block.type]}
        <div className="flex flex-col">
          <span className="font-semibold sm:truncate sm:w-[450px]">
            {block.label}
          </span>
          <div>
            <span className="text-xs">{block.type}</span>
            {block.required && <span className="text-red-500">*</span>}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-0.5">
        <BlockSettings block={block}>
          <Button variant={"ghost"} size={"sm"}>
            <SettingsIcon className="w-4 h-4" />
          </Button>
        </BlockSettings>
        <Button
          onClick={() => removeBlock(block.id)}
          variant={"ghost"}
          size={"sm"}
          className="hover:text-red-500">
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default Block;
