import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { minWidth640 } from "@/helpers/constants";
import { BlockProps } from "@/models/form";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const BlockSettings = ({
  children,
  block,
}: {
  children: React.ReactNode;
  block: BlockProps;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent>
          <Body block={block} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <Body block={block} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ block }: { block: BlockProps }) => {
  return (
    <div className="flex justify-center items-center h-full flex-col gap-4">
      <span>{block.id}</span>
      <span>{block.label}</span>
    </div>
  );
};

export default BlockSettings;
