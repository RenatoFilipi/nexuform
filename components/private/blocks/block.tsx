import { Button } from "@/components/ui/button";
import { block } from "@/utils/types";
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

import { EBlock } from "@/utils/entities";
import type { JSX } from "react";

const icons: { [key in block]: JSX.Element } = {
  short_text: <EqualIcon className="w-4 h-4" />,
  paragraph_text: <TextIcon className="w-4 h-4" />,
  checkboxes: <CheckSquareIcon className="w-4 h-4" />,
  multiple_choice: <CheckCircleIcon className="w-4 h-4" />,
  dropdown_menu: <ChevronDownIcon className="w-4 h-4" />,
  number_input: <HashIcon className="w-4 h-4" />,
  email_address: <MailIcon className="w-4 h-4" />,
  star_rating: <StarIcon className="w-4 h-4" />,
  custom_scale: <ScaleIcon className="w-4 h-4" />,
};

const Block = ({ block }: { block: EBlock }) => {
  return (
    <div className="flex border rounded justify-between items-center shadow-none w-full p-2">
      <div className="flex gap-1 w-full items-center h-full">
        <div className="flex justify-center items-center bg-primary/10 relative p-2 h-full rounded">
          {icons[block.type as block]}
        </div>
        <div className="flex">
          <span className="text-xs relative p-2 font-medium">
            {block.name}
            {block.required && (
              <span className="text-red-500 absolute ml-1">*</span>
            )}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-0 h-full">
        <Button
          variant="ghost"
          size="icon"
          className="flex justify-center items-center gap-2 h-full rounded-none">
          <Settings2Icon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Block;
