import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BlockModel } from "@/helpers/models";
import { block } from "@/helpers/types";
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

const icons: { [key in block]: JSX.Element } = {
  short_text: <EqualIcon className="w-5 h-5 text-background" />,
  paragraph_text: <TextIcon className="w-5 h-5 text-background" />,
  checkboxes: <CheckSquareIcon className="w-5 h-5 text-background" />,
  multiple_choice: <CheckCircleIcon className="w-5 h-5 text-background" />,
  dropdown_menu: <ChevronDownIcon className="w-5 h-5 text-background" />,
  number_input: <HashIcon className="w-5 h-5 text-background" />,
  email_address: <MailIcon className="w-5 h-5 text-background" />,
  star_rating: <StarIcon className="w-5 h-5 text-background" />,
  custom_scale: <ScaleIcon className="w-5 h-5 text-background" />,
};

const Block = (block: BlockModel) => {
  return (
    <Card className="flex justify-between items-center shadow-none rounded-none w-full">
      <div className="flex gap-1 w-full items-center h-full">
        <div className="flex justify-center items-center bg-foreground/80 relative p-2 h-full">
          {icons[block.type]}
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
