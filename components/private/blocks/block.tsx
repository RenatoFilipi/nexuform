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
  GripVerticalIcon,
  HashIcon,
  MailIcon,
  ScaleIcon,
  Settings2Icon,
  StarIcon,
  TextIcon,
  TrashIcon,
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
      <div className="flex justify-center items-center gap-3 w-full">
        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center bg-foreground/20 p-2 rounded relative rounded-r-none">
            {blockIcons[block.type]}
          </div>
          {/* {block.required && <Badge2 variant={"red"}>Required</Badge2>} */}
        </div>
        <div className="flex flex-col w-full">
          <span className="font-semibold sm:truncate sm:w-[360px]">
            {block.name}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-0">
        <BlockSettings block={block}>
          <Button
            variant="ghost"
            size="sm"
            className="flex justify-center items-center gap-2">
            <Settings2Icon className="w-4 h-4" />
          </Button>
        </BlockSettings>
        <Button
          onClick={() => removeBlock(block.id)}
          variant="ghost"
          size="sm"
          className="hover:text-red-500 flex justify-center items-center gap-2">
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

const DragButton = () => (
  <Button variant="ghost">
    <GripVerticalIcon />
  </Button>
);

export default Block;
