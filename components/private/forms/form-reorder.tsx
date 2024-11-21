import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { minWidth640 } from "@/helpers/constants";
import { blockName } from "@/helpers/functions";
import { block, setState } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";
import { Reorder } from "framer-motion";
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
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

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

const FormReorder = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="min-w-[550px]">
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-3">
        <Body setState={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  const { blocks, setBlocks } = useEditorStore();

  const onReorderedBlocks = (payload: BlockProps[]) => {
    const newPositionBlocks = payload.map((pay, index) => {
      return { ...pay, position: index + 1 };
    });
    setBlocks(newPositionBlocks);
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <h1 className="text-xl font-semibold">Reorder blocks</h1>
      {blocks.length <= 0 && (
        <div className="flex justify-center items-center py-4">
          <span className="text-sm text-foreground/80">
            No blocks to reorder.
          </span>
        </div>
      )}
      {blocks.length >= 1 && (
        <Reorder.Group
          axis="y"
          onReorder={(e) => onReorderedBlocks(e)}
          values={blocks}
          className="flex flex-col gap-2">
          {blocks.map((block) => {
            return <Item key={block.id} block={block} />;
          })}
        </Reorder.Group>
      )}

      <div className="flex justify-end items-center">
        <Button
          onClick={() => setState(false)}
          variant={"secondary"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};

const Item = ({ block }: { block: BlockProps }) => {
  return (
    <Reorder.Item
      value={block}
      id={block.id}
      className="flex border cursor-grab bg-background">
      <div className="flex justify-center items-center bg-foreground/80 relative p-2 h-full">
        {blockIcons[block.type]}
      </div>
      <div className="flex flex-col p-2">
        <span className="text-sm font-semibold">{blockName(block.type)}</span>
        <span className="text-sm text-foreground/80">{block.name}</span>
      </div>
    </Reorder.Item>
  );
};

export default FormReorder;
