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
import BlockSettings from "./block-settings";

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
    <div className="flex border rounded justify-between items-center shadow-none w-full px-2 min-h-14">
      <div className="flex gap-1 w-full items-center h-full">
        <div className="flex justify-center items-center bg-primary/10 relative p-2 rounded w-9 h-9">
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
        <BlockSettings block={block}>
          <button className="flex justify-center items-center border w-9 h-9 rounded hover:bg-foreground/10">
            <Settings2Icon className="w-4 h-4" />
          </button>
        </BlockSettings>
      </div>
    </div>
  );
};

export default Block;
