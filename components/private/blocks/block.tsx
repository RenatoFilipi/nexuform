import { TBlock } from "@/utils/types";
import {
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  EqualIcon,
  HashIcon,
  MailIcon,
  ScaleIcon,
  StarIcon,
  TextIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EBlock } from "@/utils/entities";
import type { JSX } from "react";
import BlockSettings from "./block-settings";

const icons: { [key in TBlock]: JSX.Element } = {
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
    <BlockSettings block={block}>
      <div className="flex flex-col justify-between gap-2 border rounded p-3 cursor-pointer hover:bg-foreground/5 group h-24">
        <div className="flex justify-between items-center gap-2 h-7">
          <div className="flex justify-center items-center gap-2">
            {icons[block.type as TBlock]}
          </div>
          <div className="flex justify-center items-center gap-2">
            {block.is_identifier && <Badge variant={"green"}>Identifier</Badge>}
            {block.required && <Badge variant={"orange"}>Required</Badge>}
          </div>
        </div>
        <div className="flex justify-start items-center overflow-y-auto">
          <p className="text-sm font-medium text-foreground/80 truncate max-w-xs">
            {block.name}
          </p>
        </div>
      </div>
    </BlockSettings>
  );
};

export default Block;
