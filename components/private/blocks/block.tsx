import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { block } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";
import {
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  EqualIcon,
  HashIcon,
  MailIcon,
  ScaleIcon,
  Settings2Icon,
  StarIcon,
  TextIcon,
} from "lucide-react";
import BlockSettings from "./block-settings";

const blockIcons: { [key in block]: JSX.Element } = {
  short_answer: <EqualIcon className="w-5 h-5" />,
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
    <Card className="flex justify-between items-center shadow-none rounded p-0 w-full">
      <div className="flex gap-2 w-full items-center pl-2">
        <div className="flex justify-center items-center bg-foreground/10 rounded relative p-1">
          {blockIcons[block.type]}
        </div>
        <div className="flex relative">
          <span className="text-sm font-medium">{block.name}</span>
          {block.required && (
            <div className="text-red-500 -right-2.5 -top-0.5 absolute">*</div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center gap-0">
        <BlockSettings block={block}>
          <Button
            variant="ghost"
            size="icon"
            className="flex justify-center items-center gap-2">
            <Settings2Icon className="w-4 h-4" />
          </Button>
        </BlockSettings>
      </div>
    </Card>
  );
};

export default Block;
