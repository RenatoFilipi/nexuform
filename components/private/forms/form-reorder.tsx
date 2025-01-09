import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { EBlock } from "@/utils/entities";
import { block, setState } from "@/utils/types";
import { Reorder } from "framer-motion";
import {
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  EqualIcon,
  HashIcon,
  MailIcon,
  PlusIcon,
  ScaleIcon,
  StarIcon,
  TextIcon,
} from "lucide-react";
import { useState, type JSX } from "react";
import { useMediaQuery } from "react-responsive";
import AddBlock from "../blocks/add-block";

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

const FormReorder = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[450px]">
          <SheetHeader>
            <SheetTitle>Reorder Blocks</SheetTitle>
            <SheetDescription>
              Reorder the blocks in your form to adjust the flow and structure.
              Drag and drop to reorder them as needed.
            </SheetDescription>
          </SheetHeader>
          <Body setState={setOpen} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-3 flex flex-col pt-10">
        <DialogHeader>
          <DialogTitle>Reorder Blocks</DialogTitle>
          <DialogDescription>
            Reorder the blocks in your form to adjust the flow and structure.
            Drag and drop to reorder them as needed.
          </DialogDescription>
        </DialogHeader>
        <Body setState={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  const { blocks, setBlocks, form } = useEditorStore();

  const onReorderedBlocks = (payload: EBlock[]) => {
    const newPositionBlocks = payload.map((pay, index) => {
      return { ...pay, position: index + 1 };
    });
    setBlocks(newPositionBlocks);
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-auto pt-4 sm:pt-0 flex-1 h-full">
      {blocks.length <= 0 && (
        <div className="flex justify-center items-center py-14 border border-dashed gap-4 flex-col h-full">
          <span className="text-sm text-foreground/80">
            No blocks to reorder.
          </span>
          <AddBlock formId={form.id}>
            <Button variant={"default"} size={"sm"}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New Block
            </Button>
          </AddBlock>
        </div>
      )}
      {blocks.length >= 1 && (
        <Reorder.Group
          axis="y"
          onReorder={(e) => onReorderedBlocks(e)}
          values={blocks}
          className="flex flex-col gap-2 overflow-y-auto max-h-[300px]">
          {blocks.map((block) => {
            return <Item key={block.id} block={block} />;
          })}
        </Reorder.Group>
      )}
      <div className="flex justify-end items-center">
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
      </div>
    </div>
  );
};

const Item = ({ block }: { block: EBlock }) => {
  return (
    <Reorder.Item
      value={block}
      id={block.id}
      className="flex border cursor-grab bg-background">
      <div className="flex justify-center items-center bg-foreground/80 relative p-2 h-full">
        {icons[block.type as block]}
      </div>
      <div className="flex flex-col p-2">
        <span className="text-sm text-foreground/80">{block.name}</span>
      </div>
    </Reorder.Item>
  );
};

export default FormReorder;
