import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import useEditorStore from "@/stores/editor";
import { Reorder } from "framer-motion";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const FormOrder = ({ children }: { children: React.ReactNode }) => {
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: setState<boolean> }) => {
  const { blocks, setBlocks } = useEditorStore();

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <h1 className="text-xl font-semibold">Reorder</h1>
      {blocks.length <= 0 && (
        <div className="flex justify-center items-center py-4">
          <span className="text-sm text-foreground/80">
            No Blocks to reorder.
          </span>
        </div>
      )}
      {blocks.length >= 1 && (
        <Reorder.Group
          axis="y"
          onReorder={setBlocks}
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
      className="flex border p-2 cursor-grab bg-background">
      <span>{block.name}</span>
    </Reorder.Item>
  );
};

export default FormOrder;
