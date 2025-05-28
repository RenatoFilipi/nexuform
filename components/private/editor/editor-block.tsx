import { TBlock } from "@/utils/types";
import {
  CalendarIcon,
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
import { useTranslations } from "next-intl";
import type { JSX } from "react";
import BlockSettings from "./editor-block-settings";

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
  date_picker: <CalendarIcon className="w-4 h-4" />,
};

const EditorBlock = ({ block }: { block: EBlock }) => {
  const t = useTranslations("app");

  return (
    <BlockSettings block={block}>
      <div className="flex flex-col justify-between gap-2 border rounded p-3 cursor-pointer hover:bg-foreground/5 group h-20">
        <div className="flex justify-between items-center gap-2 h-7">
          <div className="flex justify-center items-center gap-2">
            {icons[block.type as TBlock]}
            {block.required && <span className="text-destructive">*</span>}
          </div>
          <div className="flex justify-center items-center gap-2">
            {block.is_identifier && <Badge variant={"green"}>{t("label_identifier")}</Badge>}
          </div>
        </div>
        <div className="flex justify-start items-center overflow-y-auto">
          <p className="text-xs text-foreground/80 truncate max-w-xs">{block.name}</p>
        </div>
      </div>
    </BlockSettings>
  );
};

export default EditorBlock;
