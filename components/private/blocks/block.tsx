import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { block } from "@/helpers/types";
import { BlockProps } from "@/models/form";
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
  short_answer: <EqualIcon className="w-5 h-5 text-background" />,
  long_answer: <TextIcon className="w-5 h-5 text-background" />,
  multiple_choice: <CheckSquareIcon className="w-5 h-5 text-background" />,
  checkboxes: <CheckCircleIcon className="w-5 h-5 text-background" />,
  dropdown: <ChevronDownIcon className="w-5 h-5 text-background" />,
  number: <HashIcon className="w-5 h-5 text-background" />,
  email: <MailIcon className="w-5 h-5 text-background" />,
  rating: <StarIcon className="w-5 h-5 text-background" />,
  scale: <ScaleIcon className="w-5 h-5 text-background" />,
};

const Block = (block: BlockProps) => {
  return (
    <Card className="flex justify-between items-center shadow-none rounded-none w-full">
      <div className="flex gap-1 w-full items-center h-full">
        <div className="flex justify-center items-center bg-foreground/80 relative p-2 h-full">
          {blockIcons[block.type]}
        </div>
        <div className="flex">
          <span className="text-sm font-medium relative p-2">
            {block.name}
            {block.required && (
              <span className="text-red-500 absolute ml-1">*</span>
            )}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-0 h-full">
        <BlockSettings block={block}>
          <Button
            variant="ghost"
            size="icon"
            className="flex justify-center items-center gap-2 h-full rounded-none">
            <Settings2Icon className="w-4 h-4" />
          </Button>
        </BlockSettings>
      </div>
    </Card>
  );
};

export default Block;
